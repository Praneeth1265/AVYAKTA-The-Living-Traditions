BEGIN;

DELETE FROM events
WHERE title IN (
  'Rangotsav Night',
  'Swar & Stage',
  'Creative Confluence'
);

INSERT INTO events (title, description, domain, highlights, timeline, date)
VALUES
  (
    'Rangotsav Night',
    'A vibrant cultural showcase blending folk dance, music, and community performances.',
    'Cultural Showcase',
    'Live folk dance; Classical music set; Student spotlight acts',
    '17:00 - Opening ceremony|18:00 - Main performances|20:00 - Closing note',
    '2026-08-12'
  ),
  (
    'Swar & Stage',
    'An evening of theatre, live vocals, and performance storytelling shaped by student artists.',
    'Music and Theatre',
    'Theatre pieces; Live vocals; Stage design showcase',
    '16:30 - Audience entry|17:30 - Theatre set|19:00 - Musical finale',
    '2026-09-03'
  ),
  (
    'Creative Confluence',
    'A cross-domain event where design thinking, performance, and collaboration come together.',
    'Design X Performance',
    'Interactive installations; Collaborative performance; Design exhibition',
    '15:00 - Opening walkthrough|16:00 - Live sessions|18:00 - Showcase close',
    '2026-10-21'
  );

WITH selected_events AS (
  SELECT id, title
  FROM events
  WHERE title IN (
    'Rangotsav Night',
    'Swar & Stage',
    'Creative Confluence'
  )
)
INSERT INTO event_slug (event_id, title, more_description)
SELECT
  id,
  title,
  CASE title
    WHEN 'Rangotsav Night' THEN 'Rangotsav Night brings together dancers, instrumentalists, and performers for a high-energy evening rooted in cultural tradition.'
    WHEN 'Swar & Stage' THEN 'Swar & Stage explores the connection between sound and storytelling through theatre, vocals, and stagecraft.'
    WHEN 'Creative Confluence' THEN 'Creative Confluence celebrates the meeting point of design and live performance, highlighting experimentation and collaboration.'
  END
FROM selected_events;

WITH selected_events AS (
  SELECT id, title
  FROM events
  WHERE title IN (
    'Rangotsav Night',
    'Swar & Stage',
    'Creative Confluence'
  )
)
INSERT INTO posters (event_id, title, poster_image_url)
SELECT
  id,
  title,
  CASE title
    WHEN 'Rangotsav Night' THEN 'linear-gradient(145deg, rgba(201,168,76,0.95), rgba(139,26,26,0.72), rgba(27,94,59,0.8))'
    WHEN 'Swar & Stage' THEN 'linear-gradient(145deg, rgba(146,121,27,0.9), rgba(28,28,28,0.7), rgba(139,26,26,0.78))'
    WHEN 'Creative Confluence' THEN 'linear-gradient(145deg, rgba(27,94,59,0.85), rgba(201,168,76,0.9), rgba(28,28,28,0.82))'
  END
FROM selected_events;

COMMIT;
