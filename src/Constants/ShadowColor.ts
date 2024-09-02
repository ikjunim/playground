const shadowColorClass = [
  'shadow-red',
  'shadow-yellow',
  'shadow-green',
  'shadow-blue',
]

export default function randomShadow() {
  return shadowColorClass[Math.floor(Math.random() * shadowColorClass.length)];
}