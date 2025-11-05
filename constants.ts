export const IMAGE_GENERATION_PROMPT = `
Please generate a single, new, photorealistic image that combines the people from all the uploaded reference images.

Scene Description:
The family members should be depicted sitting together around a rectangular wooden table, sharing a joyful Tet meal. The table is abundantly filled with traditional Vietnamese Tet foods, including Banh Chung, fried spring rolls (Nem Ran), a whole boiled chicken, and various colorful fruits.

Atmosphere & Style:
The mood is happy, warm, and celebratory. The lighting should be bright and inviting, as if in a cozy home setting during the day. The style should be photorealistic, as if taken with a high-quality camera. The family members should be looking towards the center of the table or interacting with each other, smiling.

Important Considerations:
1. Preserve the likeness of each individual from the reference photos.
2. Arrange the people naturally around the table.
3. Ensure the Tet food and setting are culturally appropriate and recognizable.
4. The final image should be well-composed and visually appealing.
`;

export const VIDEO_GENERATION_PROMPT = `
Generate an 8-second video based on the provided image. The video should bring the scene to life with subtle animations and appropriate sound effects.

Animation Details:
*   Subtle movements from the family members: gentle smiles, slight head turns, perhaps one person gesturing.
*   A hint of steam rising from the hot food on the table.
*   The background should remain relatively static.

Audio Design:
*   The primary audio should be a warm mix of soft laughter.
*   In the background, include the occasional sound of distant fireworks and other festive Tet sounds.
*   A gentle, instrumental Vietnamese Tet/Lunar New Year theme song should play softly in the background.
*   There should be no talking or chatter.
*   The overall audio should be cheerful and festive, enhancing the visual.

Video Style:
Maintain a smooth, cinematic feel. The animation should be natural and not overly exaggerated.
Length: 8 seconds.
`;

export const VIDEO_LOADING_MESSAGES = [
    'Bringing your family photo to life...',
    'Adding festive sounds of laughter and fireworks...',
    'Arranging the Tet feast...',
    'This magic moment is taking a bit longer than usual...',
    'Polishing the final frames...',
    'Almost there, the celebration is about to begin!'
];