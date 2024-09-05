export const sql = {
  base: {
    queryBaseLibs: `SELECT name, origin_id AS id
      FROM BK_TB
      WHERE origin_id in (
          SELECT DISTINCT book_origin_id
          FROM BK_VOC_TB)
      ORDER BY name`,
    queryBaseLibWordsByID: `SELECT spelling AS word, list
      FROM VOC_TB
          INNER JOIN (
            SELECT
              C.title AS list,
              V.voc_origin_id,
              V."order"
            FROM
              BK_VOC_TB AS V
              INNER JOIN BK_CHAPTER_TB AS C ON V.chapter_origin_id = C.id
            WHERE V.book_origin_id = ?) AS tmp ON VOC_TB.origin_id = tmp.voc_origin_id
      ORDER BY "order"`,
    queryMemorizedWords: `SELECT spelling as word
     FROM LSR_TB AS LT INNER JOIN VOC_TB AS VT ON LT.lsr_new_voc_id = VT.id`,
    queryWordByID: `SELECT spelling as word
        FROM VOC_TB
        WHERE id = ?
        `,
  },
  cloud: {
    queryCloudLibs: `SELECT title as name, id
       FROM notepad
       order by name`,
    queryCloudLibWordsIDByID: `
        SELECT voc_id as id, voc_tag as list
        FROM notepad INNER JOIN (
            SELECT tag as voc_tag, "order" as voc_order, voc_id, notepad_id
            FROM notepad_voc
            ) as tmp ON tmp.notepad_id = id
        where notepad_id = ?
        ORDER by voc_order`,
  },
}
