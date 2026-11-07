import { BotClient } from "#core/BotClient";

async function main(): Promise<void> {
  const bot = new BotClient();
  const shutdown = () => {
    bot.destroy().catch((error) => {
      console.error("Bot shutdown failed:", error);
      process.exitCode = 1;
    });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  try {
    await bot.start();
  } catch (error) {
    await bot.destroy();
    throw error;
  }
}

main().catch((error) => {
  console.error("Bot startup failed:", error);
  process.exitCode = 1;
});
