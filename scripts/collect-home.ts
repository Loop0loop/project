import { chromium, type Locator, type Page } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const BASE_URL = "https://live.ecomm-data.com/assignment";
const PROFILE_PATH = resolve(".playwright-profile");
const OUTPUT_PATH = resolve("src/data/broadcasts-home.json");

type AssignmentType = "lb" | "hs";

type BroadcastRow = {
  rank: number;
  title: string;
  platform: string;
  category: string;
  broadcastTime: string;
  audience: string;
  salesCount: string;
  salesAmount: string;
  productCount: string;
};

type CollectedTable = {
  metricLabel: string;
  rows: BroadcastRow[];
};

type NextData = {
  props?: {
    pageProps?: {
      type?: string;
      list?: unknown[];
    };
  };
};

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map(cleanText)
    .filter(Boolean);
}

async function readNextData(page: Page): Promise<NextData> {
  const text = await page.locator("#__NEXT_DATA__").textContent();

  if (!text) {
    throw new Error("__NEXT_DATA__를 찾지 못했습니다.");
  }

  return JSON.parse(text) as NextData;
}

async function getVisibleTable(page: Page): Promise<Locator> {
  const table = page.locator("table:visible").first();

  await table.waitFor({
    state: "visible",
    timeout: 30_000,
  });

  await table.locator("tbody tr").first().waitFor({
    state: "visible",
    timeout: 30_000,
  });

  return table;
}

async function collectTable(page: Page): Promise<CollectedTable> {
  const table = await getVisibleTable(page);

  const headers = (await table.locator("thead th").allInnerTexts()).map(
    cleanText,
  );

  const cellsByRow = await table.locator("tbody tr").evaluateAll((rows) =>
    rows.slice(0, 10).map((row) =>
      Array.from(row.querySelectorAll("td")).map(
        (cell) => (cell as HTMLElement).innerText,
      ),
    ),
  );

  const rows = cellsByRow.map((cells, index): BroadcastRow => {
    if (cells.length < 8) {
      throw new Error(
        `${index + 1}번째 행의 셀 개수가 부족합니다: ${cells.length}`,
      );
    }

    const broadcastInfo = splitLines(cells[1] ?? "");

    return {
      rank: Number(cleanText(cells[0] ?? "")) || index + 1,
      title: broadcastInfo[0] ?? "",
      platform: broadcastInfo.slice(1).join(" "),
      category: cleanText(cells[2] ?? ""),
      broadcastTime: cleanText(cells[3] ?? ""),
      audience: cleanText(cells[4] ?? ""),
      salesCount: cleanText(cells[5] ?? ""),
      salesAmount: cleanText(cells[6] ?? ""),
      productCount: cleanText(cells[7] ?? ""),
    };
  });

  return {
    metricLabel: headers[4] || "조회수/시청률",
    rows,
  };
}

async function collectType(
  page: Page,
  type: AssignmentType,
): Promise<CollectedTable> {
  const url = new URL(BASE_URL);
  url.searchParams.set("type", type);

  console.log(`접속 중: ${url.toString()}`);

  await page.goto(url.toString(), {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });

  const nextData = await readNextData(page);
  const actualType = nextData.props?.pageProps?.type;

  console.log(`요청 유형: ${type}`);
  console.log(`응답 유형: ${actualType}`);
  console.log(`현재 주소: ${page.url()}`);

  if (actualType !== type) {
    await page.screenshot({
      path: `debug-${type}.png`,
      fullPage: true,
    });

    throw new Error(
      [
        `요청한 유형은 "${type}"이지만 서버 응답 유형은 "${actualType}"입니다.`,
        `현재 URL: ${page.url()}`,
        `debug-${type}.png를 확인하세요.`,
      ].join("\n"),
    );
  }

  const result = await collectTable(page);

  if (result.rows.length !== 10) {
    throw new Error(
      `${type} 유형에서 10개가 아닌 ${result.rows.length}개가 수집됐습니다.`,
    );
  }

  return result;
}

async function main(): Promise<void> {
  const context = await chromium.launchPersistentContext(PROFILE_PATH, {
    headless: false,
    viewport: {
      width: 1440,
      height: 1000,
    },
  });

  const page = context.pages()[0] ?? (await context.newPage());

  await page.goto(BASE_URL, {
    waitUntil: "domcontentloaded",
  });

  console.log("");
  console.log("열린 브라우저에서 로그인하세요.");
  console.log("로그인 후 /assignment의 실제 값이 보이는지 확인하세요.");
  console.log("");

  const rl = readline.createInterface({
    input,
    output,
  });

  await rl.question("로그인이 완료되면 Enter를 누르세요: ");
  rl.close();

  const live = await collectType(page, "lb");
  console.log(`라방 ${live.rows.length}개 수집 완료`);

  const homeShopping = await collectType(page, "hs");
  console.log(`홈쇼핑 ${homeShopping.rows.length}개 수집 완료`);

  const result = {
    collectedAt: new Date().toISOString(),
    live,
    homeShopping,
  };

  await mkdir(resolve("src/data"), {
    recursive: true,
  });

  await writeFile(
    OUTPUT_PATH,
    JSON.stringify(result, null, 2),
    "utf-8",
  );

  console.log(`저장 완료: ${OUTPUT_PATH}`);

  await context.close();
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});