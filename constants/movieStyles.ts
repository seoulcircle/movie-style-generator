import { MovieStyle } from '@/types';

export const MOVIE_STYLES: MovieStyle[] = [
  {
    id: 'her',
    name: 'Her',
    description: 'soft pastel coral and teal minimalist melancholic warm futuristic',
    prompt: 'movie Her aesthetic, soft pastel color palette with coral salmon peach and teal tones, minimalist retro-futuristic interior, warm natural window lighting, shallow depth of field, melancholic nostalgic atmosphere, mid-century modern furniture, clean spacious room, desaturated warm tones, gentle bokeh city lights, lonely contemplative mood, Spike Jonze cinematography, shot on 35mm film, slight grain, soft focus',
    negative: 'oversaturated, vivid colors, dark gritty, harsh lighting, cluttered, modern sleek, cold tones, cartoon, low quality, sharp background',
    color: 'from-orange-300 to-teal-400',
  },
  {
    id: 'harry-potter',
    name: 'Harry Potter',
    description: 'magical atmosphere dark academia candlelit castle mysterious enchanted',
    prompt: 'Harry Potter movie style, magical atmosphere, dark academia aesthetic, candlelit medieval castle, mysterious enchanted environment, warm golden lighting, cinematic fantasy, moody dramatic lighting, Hogwarts inspired, film grain',
    negative: 'modern, futuristic, bright daylight, low quality, cartoon',
    color: 'from-amber-600 to-slate-700',
  },
  {
    id: 'grand-budapest-hotel',
    name: 'Grand Budapest Hotel',
    description: 'symmetrical pastel pink purple whimsical vintage hotel interior',
    prompt: 'symmetrical composition, pastel pink and purple colors, whimsical aesthetic, vintage hotel interior, centered framing, Wes Anderson style, soft lighting, highly detailed',
    negative: 'dark, gritty, asymmetric, modern, low quality',
    color: 'from-pink-400 to-purple-400',
  },
];