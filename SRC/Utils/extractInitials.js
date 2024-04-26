export function extractInitials(fullName) {
  // Split the full name into individual words
  const words = fullName?.split(' ');

  // Extract the first character of the first two words and concatenate them
  let initials = '';
  for (let i = 0; i < Math.min(2, words?.length); i++) {
    initials += words[i].charAt(0);
  }

  return initials;
}
