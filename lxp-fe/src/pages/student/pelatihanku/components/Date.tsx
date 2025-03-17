export const formatToIndonesianDateTime = (
  date: string | null | undefined
): string => {
  if (!date) return "-";

  return (
    new Date(date).toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }) + " WIB"
  );
};

export const calculateRemainingTime = (
  deadline: string | null | undefined
): string => {
  if (!deadline) return "-";

  const deadlineDate = new Date(deadline).getTime();
  const currentDate = new Date().getTime();
  const diffInMilliseconds = deadlineDate - currentDate;

  // Jika waktu sudah lewat deadline
  if (diffInMilliseconds < 0) {
    return "Waktu habis";
  }

  // Konversi ke hari, jam, menit
  const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );

  // Format output
  const result: string[] = [];
  if (days > 0) result.push(`${days} hari`);
  if (hours > 0) result.push(`${hours} jam`);
  if (minutes > 0) result.push(`${minutes} menit`);

  return result.length > 0 ? result.join(" ") : "Kurang dari 1 menit";
};
