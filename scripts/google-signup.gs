const SHEET_NAME = 'Signups'
const SECRET_KEY = 'SIGNUP_SECRET'

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents)
    const secret = PropertiesService.getScriptProperties().getProperty(SECRET_KEY)

    if (!secret || body.secret !== secret) {
      return json({ ok: false, error: 'Unauthorized' })
    }

    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const ip = String(body.ip || '').trim()

    if (!name || !email) {
      return json({ ok: false, error: 'Name and email are required' })
    }

    const groups = Array.isArray(body.groups) ? body.groups : []
    const fdm = groups.includes('fdm')
    const fmaq = groups.includes('fmaq')

    if (!fdm && !fmaq) {
      return json({ ok: false, error: 'Select at least one group' })
    }

    getSheet().appendRow([new Date().toISOString(), name, email, ip, fdm, fmaq])
    return json({ ok: true })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(['timestamp', 'name', 'email', 'ip', 'fdm', 'fmaq'])
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold')
    sheet.setFrozenRows(1)
  }
  return sheet
}

function setup() {
  getSheet()
  Logger.log('Sheet ready. Set SIGNUP_SECRET in Script properties, then deploy as web app.')
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
