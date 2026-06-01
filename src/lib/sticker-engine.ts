import { prisma } from "./prisma";

const PACK_SIZE = 7;
const MAX_GOLD_PER_PACK = 1;
const PACK_COOLDOWN_HOURS = 24;

export async function canOpenPack(userId: string): Promise<{
  canOpen: boolean;
  nextPackAt?: Date;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastPackAt: true },
  });

  if (!user?.lastPackAt) return { canOpen: true };

  const now = new Date();
  const nextPackAt = new Date(user.lastPackAt);
  nextPackAt.setHours(nextPackAt.getHours() + PACK_COOLDOWN_HOURS);

  if (now >= nextPackAt) return { canOpen: true };

  return { canOpen: false, nextPackAt };
}

export async function openPack(userId: string) {
  const { canOpen, nextPackAt } = await canOpenPack(userId);
  if (!canOpen) {
    throw new Error(`Pack not available yet. Next pack at: ${nextPackAt}`);
  }

  const allStickers = await prisma.sticker.findMany();

  const selectedStickers: typeof allStickers = [];
  let goldCount = 0;

  for (let i = 0; i < PACK_SIZE; i++) {
    const available = allStickers.filter((s) => {
      if (goldCount >= MAX_GOLD_PER_PACK && s.rarity === "gold") return false;
      return true;
    });

    const totalWeight = available.reduce((sum, s) => sum + s.dropWeight, 0);
    let rand = Math.random() * totalWeight;

    let selected = available[0];
    for (const sticker of available) {
      rand -= sticker.dropWeight;
      if (rand <= 0) {
        selected = sticker;
        break;
      }
    }

    if (selected.rarity === "gold") goldCount++;
    selectedStickers.push(selected);
  }

  // Update user inventory
  for (const sticker of selectedStickers) {
    await prisma.userSticker.upsert({
      where: { userId_stickerId: { userId, stickerId: sticker.id } },
      update: { quantity: { increment: 1 } },
      create: { userId, stickerId: sticker.id, quantity: 1 },
    });
  }

  // Update lastPackAt
  await prisma.user.update({
    where: { id: userId },
    data: { lastPackAt: new Date() },
  });

  return selectedStickers;
}
