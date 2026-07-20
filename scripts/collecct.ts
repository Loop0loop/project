import { chromium, type Locator, type Page } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const ASSIGNMENT_URL = "https://live.ecomm-data.com/assignment";
const PROFILE_PATH = resolve(".playwright-profile");
const OUTPUT_PATH = resolve("src/data/broadcasts.json");

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

type BroadcastTable = {
  metricLabel: string;
  rows: BroadcastRow[];
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

async function collectCurrentTable(page: Page): Promise<BroadcastTable> {
  const table = await getVisibleTable(page);

  const headers = (await table.locator("thead th").allInnerTexts()).map(
    cleanText,
  );

  const rawRows = await table.locator("tbody tr").evaluateAll((elements) =>
    elements.slice(0, 10).map((row) =>
      Array.from(row.querySelectorAll("td")).map((cell) =>
        (cell as HTMLElement).innerText.trim(),
      ),
    ),
  );

  const rows: BroadcastRow[] = rawRows.map((cells, index) => {
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

  const hasLockedValue = rows.some((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        (value.includes("🔒") || value.includes("로그인 후")),
    ),
  );

  if (hasLockedValue) {
    throw new Error(
      "잠긴 값이 발견되었습니다. Playwright 브라우저에서 로그인했는지 확인하세요.",
    );
  }

  return {
    metricLabel: headers[4] || "조회수/시청률",
    rows,
  };
}

async function clickTab(page: Page, name: "라방" | "홈쇼핑"): Promise<void> {
  const button = page.getByRole("button", {
    name,
    exact: true,
  });

  await button.waitFor({
    state: "visible",
    timeout: 10_000,
  });

  await button.click();

  await page.waitForFunction(
    (tabName) => {
      const buttons = Array.from(document.querySelectorAll("button"));

      const activeButton = buttons.find(
        (item) =>
          item.textContent?.trim() === tabName &&
          item.className.includes("active"),
      );

      return Boolean(activeButton);
    },
    name,
    {
      timeout: 10_000,
    },
  );

  // React 상태 변경과 테이블 렌더링을 기다립니다.
  await page.waitForTimeout(500);
}

async function main(): Promise<void> {
  const context = await chromium.launchPersistentContext(PROFILE_PATH, {
    headless: false,
    viewport: {
      width: 1440,
      height: 1000,
    },
  });

  const pages = context.pages();
  const page = pages[0] ?? (await context.newPage());

  await page.goto(ASSIGNMENT_URL, {
    waitUntil: "domcontentloaded",
  });

  console.log("");
  console.log("브라우저가 열렸습니다.");
  console.log("1. 브라우저에서 사이트에 로그인하세요.");
  console.log("2. /assignment 페이지에서 실제 데이터가 보이는지 확인하세요.");
  console.log("3. 확인 후 터미널로 돌아와 Enter를 누르세요.");
  console.log("");

  const rl = readline.createInterface({
    input,
    output,
  });

  await rl.question("로그인과 데이터 확인이 끝났으면 Enter: ");
  rl.close();

  // 로그인 후 과제 페이지로 다시 이동합니다.
  await page.goto(ASSIGNMENT_URL, {
    waitUntil: "domcontentloaded",
  });

  await clickTab(page, "라방");
  const live = await collectCurrentTable(page);

  console.log(`라방 ${live.rows.length}개 수집 완료`);

  await clickTab(page, "홈쇼핑");
  const homeShopping = await collectCurrentTable(page);

  console.log(`홈쇼핑 ${homeShopping.rows.length}개 수집 완료`);

  const result = {
    collectedAt: new Date().toISOString(),
    live,
    homeShopping,
  };

  await mkdir(resolve("src/data"), {
    recursive: true,
  });

  await writeFile(OUTPUT_PATH, JSON.stringify(result, null, 2), "utf-8");

  console.log("");
  console.log(`저장 완료: ${OUTPUT_PATH}`);

  await context.close();
}

main().catch((error: unknown) => {
  console.error("");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});