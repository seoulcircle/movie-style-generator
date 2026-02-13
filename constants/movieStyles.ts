import { MovieStyle } from '@/types';

export const MOVIE_STYLES: MovieStyle[] = [
  {
    id: 'her',
    name: 'Her',
    description: 'warm teal and orange color melancholy atmosphere',
    prompt: 'cinematic still from movie Her, person at desk with glowing computer screen, night time office interior, bokeh city lights through large windows behind, warm amber desk lamp lighting, cool teal blue exterior glow, shallow depth of field, melancholic lonely atmosphere, urban isolation, desaturated teal and orange color palette, shot on 35mm film, slight film grain, professional cinematography, modern minimalist office, wooden desk',
    negative: 'bright daylight, oversaturated, vivid colors, cartoon, anime, 3d render, low quality, deformed, multiple people, cluttered, sharp background',
    color: 'from-orange-400 to-teal-500',
  },
  {
    id: 'harry-potter',
    name: 'Harry Potter',
    description: 'magical atmosphere dark academia candlelit castle mysterious enchanted',
    prompt: 'Harry Potter movie aesthetic, Hogwarts castle interior, Gothic architecture, warm candlelight and torch lighting, magical atmosphere, people in school robes, stone walls and arches, dark academia aesthetic, cozy warm color grading with golden tones, cinematic film look, slightly desaturated, ambient occlusion, detailed medieval interior, mysterious mood, shot on film',
    negative: 'bright modern lighting, futuristic, neon, cyberpunk, oversaturated, cartoon style, low quality, outdoor, daytime, contemporary architecture',
    color: 'from-amber-600 to-slate-700',
  },
  {
    id: 'grand-budapest-hotel',
    name: 'Grand Budapest Hotel',
    description: 'symmetrical pastel pink purple whimsical vintage hotel interior',
    prompt: 'Wes Anderson style, perfectly symmetrical composition, pastel pink and purple building, ornate baroque architecture, centered framing, miniature diorama aesthetic, soft dreamy lighting, whimsical fantasy atmosphere, mountains in background, vintage European hotel, highly detailed decorative elements, flat color palette, storybook illustration style, nostalgic tone, shot on film',
    negative: 'asymmetric, dark, gritty, modern, realistic photography, cluttered, chaotic composition, low quality, blurry',
    color: 'from-pink-400 to-purple-400',
  },
];