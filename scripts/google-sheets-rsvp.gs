/** À coller dans Extensions > Apps Script du Google Sheet. */
function initialiser() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Ouvrez Apps Script depuis votre Google Sheet.');
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('SPREADSHEET_ID', spreadsheet.getId());
  if (!properties.getProperty('RSVP_SECRET')) {
    properties.setProperty('RSVP_SECRET', Utilities.getUuid() + Utilities.getUuid());
  }
  const sheet = spreadsheet.getSheetByName('Réponses') || spreadsheet.insertSheet('Réponses');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date de réception', 'Nom', 'Téléphone', 'Présence', 'Côté', 'Message']);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#dce5d5');
    sheet.autoResizeColumns(1, 6);
  }
  console.log('Configuration terminée. La clé RSVP_SECRET est dans les propriétés du script.');
}

function doPost(e) {
  const json = value => ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
  let lock;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 8000) return json({ ok: false, error: 'Requête invalide.' });
    const data = JSON.parse(raw);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('RSVP_SECRET');
    if (!secret || data.secret !== secret) return json({ ok: false, error: 'Accès refusé.' });
    const sides = ['Du côté de la mariée', 'Du côté du marié', 'Du côté des parents de la mariée', 'Du côté des parents du marié'];
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    if (name.length < 2 || name.length > 120 || phone.length < 6 || phone.length > 40 ||
        !/^[+\d\s().-]+$/.test(phone) || !['yes', 'no'].includes(data.attendance) ||
        !sides.includes(data.side) || message.length > 1000) {
      return json({ ok: false, error: 'Informations invalides.' });
    }
    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    const sheet = SpreadsheetApp.openById(properties.getProperty('SPREADSHEET_ID')).getSheetByName('Réponses');
    if (!sheet) throw new Error('Initialisation requise.');
    // Le préfixe apostrophe conserve les téléphones et neutralise les formules.
    const literal = value => "'" + value;
    sheet.appendRow([new Date(), literal(name), literal(phone), data.attendance === 'yes' ? 'Oui' : 'Non', literal(data.side), literal(message)]);
    SpreadsheetApp.flush();
    return json({ ok: true });
  } catch (_) {
    return json({ ok: false, error: 'Enregistrement impossible. Veuillez réessayer.' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
