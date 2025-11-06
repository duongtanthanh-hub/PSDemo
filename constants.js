// A base64 encoded version of the P/S logo to be used for the header and watermarking.
export const PS_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX///8AQUEAXLgAV7cAWrj6+vr19fXp6ekAUbQAULQAQLT4+PjNzMwgJTEASrPz8/PExMQANT4ARbIBN0AAKzQAMj8ALzU+Q0tIR1A0OUQoMDeGiYtWWF5gaXBTWF+Pk5lJT1ZudH3i4uN8f4QzPkhkbXqop6q2uLzY2dkwOkdFTldqAAAGbElFTkSuQmCC';

export const IMAGE_GENERATION_PROMPT = `
**PRIMARY DIRECTIVE (NON-NEGOTIABLE): FACIAL FIDELITY**
Your absolute, number one priority is the perfect and exact replication of the facial features of each individual from their respective reference photograph. There is ZERO tolerance for deviation. The final image will be judged solely on how recognizably and accurately each person is portrayed. Do not proceed with generation if you cannot guarantee a high-fidelity likeness.

**Facial Replication Protocol:**
1.  **Isolate & Analyze:** Treat each uploaded reference photo as a distinct data source for one individual. Analyze the unique facial geometry, landmarks (eye corners, nose tip, lip corners), and textures.
2.  **Reconstruct with Precision:** Recreate each face with meticulous attention to detail. This includes:
    -   **Eye Shape, Spacing, and Color:** Must be identical to the source.
    -   **Nose Structure:** Bridge width, tip shape, and nostril size must match.
    -   **Mouth and Smile:** The shape of the lips, the way they curve, and the appearance of teeth must be a direct copy.
    -   **Unique Identifiers:** Replicate moles, freckles, scars, and specific wrinkles or smile lines exactly as they appear.
3.  **Verify Likeness:** Before finalizing, internally compare the generated face against the source photo. If it looks like a "cousin" or a "sibling," it is a failure. It must look like the *same person*.

**Scene Configuration:**
- **Objective:** Place the accurately rendered individuals into a single, cohesive scene. The scene serves as a backdrop for the people.
- **Setting:** A joyful Vietnamese Tet family meal. The family is seated around a rectangular wooden table filled with traditional Tet foods (Banh Chung, Nem Ran, boiled chicken, fruits).
- **Environment:** A warm, brightly lit indoor home setting, with soft, natural light coming from an off-camera window.
- **Interaction:** The individuals should be arranged naturally, interacting candidly. Show them smiling, laughing, and sharing the moment. Their expressions should be joyous and genuine.

**Photographic Style:**
- **Goal:** Emulate a professional photograph taken with a high-end DSLR camera and a prime lens (e.g., 85mm f/1.8).
- **Realism Details:**
    -   **Focus:** Sharp focus on the faces.
    -   **Bokeh:** A soft, pleasing blur (bokeh) in the background to draw attention to the family.
    -   **Texture:** Render realistic skin textures, including pores and fine lines. Avoid an airbrushed or plastic look.
    -   **Lighting:** Natural catchlights in the eyes. Soft shadows on the faces that define their features realistically.

**STRICT PROHIBITIONS:**
-   **ABSOLUTELY NO** composite or blended faces.
-   **DO NOT** alter or "beautify" facial features.
-   **DO NOT** generate generic, stock-photo-like people.
-   **AVOID** the uncanny valley at all costs. Lifeless eyes or unnatural expressions are unacceptable.
-   **ENSURE** hands and body proportions are correct and natural.
`;

export const VIDEO_GENERATION_PROMPT = `
Generate an 8-second, high-definition (720p) video based on the provided image.

**CRITICAL REQUIREMENT: PRESERVE LIKENESS & WATERMARK**
1.  **Likeness:** The absolute top priority is that the individuals in the video MUST maintain a strong and consistent likeness to the people in the source image. Facial features, hair, clothing, and overall appearance must not change, distort, or morph.
2.  **Watermark Preservation:** The source image contains a "P/S" logo watermark in the bottom-right corner. It is critical that you preserve this logo, keeping it static and clearly visible throughout the entire 8-second video.

**Animation Details (Subtle & Realistic):**
*   **Family Members:** Animate with extremely subtle movements. A slow blink, a gentle smile widening slightly, a minor head turn as if listening to someone. Avoid large gestures.
*   **Shining Teeth Effect:** As the family smiles, add a very noticeable star-like glint effect to their teeth to emphasize their bright smiles.
*   **Atmosphere:** A faint hint of steam should gently rise from one of the hot dishes on the table.
*   **Background:** The background and table setting should remain static.

**Audio Design:**
*   **Primary Audio:** A warm, gentle mix of soft, happy laughter.
*   **Sparkle Sound:** Synchronize a subtle, magical 'chime' or 'ping' sound effect with the appearance of the teeth sparkle.
*   **Ambient Sounds:** In the far background, include the occasional soft pop of distant fireworks.
*   **Music:** A very quiet, gentle, instrumental Vietnamese Tet/Lunar New Year melody should play softly underneath.
*   **Dialogue:** Absolutely no talking or distinct chatter.
*   **Overall Mix:** The audio should be cheerful and festive but not overwhelming, creating a warm and heartfelt atmosphere.

**Video Style:**
- **Pacing:** Smooth, slow, and cinematic.
- **Length:** Exactly 8 seconds.
`;

export const VIDEO_LOADING_MESSAGES: string[] = [
    'Bringing your family photo to life...',
    'Adding festive sounds of laughter and fireworks...',
    'Arranging the Tet feast...',
    'This magic moment is taking a bit longer than usual...',
    'Polishing the final frames...',
    'Almost there, the celebration is about to begin!'
];