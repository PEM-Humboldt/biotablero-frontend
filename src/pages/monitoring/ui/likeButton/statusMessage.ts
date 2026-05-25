const textNumbers: Record<number, string> = {
  1: "una",
  2: "dos",
  3: "tres",
  4: "cuatro",
  5: "cinco",
};

export const likeMessages = {
  noUser: 'Inicia sesión para poder dar "Me gusta"',
  btn: {
    title: "Me gusta",
    label: "Me gusta",
    sr: "Dar 'Me gusta'",
  },
};

export function makeLikeStatusMsg(
  iLikeIt: boolean,
  likes: number,
  disabled: boolean,
) {
  if (likes === 0) {
    return 'Da el primer "Me gusta"';
  }

  if (iLikeIt && likes === 1) {
    return "A tí te gusta";
  }

  const othersCount = iLikeIt ? likes - 1 : likes;
  const getPlural = (count: number) => (count === 1 ? "" : "s");
  const countStr = textNumbers[othersCount] ?? othersCount;
  let plural = getPlural(likes);

  if (disabled) {
    const totalCount = textNumbers[likes] ?? likes;
    return `A ${totalCount} persona${plural} le${plural} gusta`;
  }

  plural = getPlural(othersCount);
  if (iLikeIt) {
    return `A ti y a ${countStr} persona${plural} más les gusta`;
  }

  return `A ${countStr} persona${plural} le${plural} gusta`;
}
