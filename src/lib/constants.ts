export type Emotion = {
  name: string;
  className: string;
};

export const emotions: Emotion[] = [
  { name: 'Happy', className: 'from-yellow-400/80 to-orange-500/80 text-white' },
  { name: 'Sad', className: 'from-blue-700/80 to-indigo-900/80 text-gray-200' },
  { name: 'Energetic', className: 'from-lime-400/80 to-green-500/80 text-gray-900' },
  { name: 'Calm', className: 'from-teal-400/80 to-cyan-600/80 text-white' },
  { name: 'Romantic', className: 'from-pink-500/80 to-purple-600/80 text-white' },
  { name: 'Angry', className: 'from-red-600/80 to-rose-800/80 text-white' },
];
