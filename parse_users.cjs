const fs = require('fs');
const crypto = require('crypto');

const csv = `אמיר,אחיטוב,532847704
שמואל,זהר,545984257
מנדי,גרינפלד,543062246
אלעזר ,ביטון ,584433205
יוסי,אסולין,524670038
מנחם,פיקל,549718917
ישראל,פיקל,544507994
צביה ,שפר,544770304
מנחם,טרנר,527080539
מנדי ,אבייב,544733117
יאיר,יצחייק,528770856
יאיר,יצחייק,528770856
יוסי,קדוש,526770457
שעיה,דובוב,523637797
אירית ,אחיטוב,546114770
יצחק,אנטיזדה,584494770
מני,דהן,546549770
נתנאל,אביטבול ,549604594
ראובן ,יוספוב,549770938
אריה,שכרטוב,547241770
חיים ,כהן ,544847018
ניצן ,סלומון,504833350
זוהר,מזרחי,533357513
יוסי,מיכלשוילי,502626995
חיים,דנה,536269261
לוי ,דנה,523599932
Goldstein ,Eli,587339271
שמואל משה ,הלבפינגר ,547651287
צבי,טסלר ,542327019
חנן,נתן,507701475
בתיה ,נתנוב,542208909
ברוך,נתנוב,556675749
צביקה,לרמן,544770304
עמנואל,אלדין,545904086
יוסי,שרון,547705930
שלמה ,רוזנברג ,515985768
שטערני,קרוגליאק ,546761289
אליהן,כהן,587280044
שלום,לישנר,529059770
שמואל ,גלינסקי,547640782
דוד,סגל,559822722
אהרן ,סברדלוב ,506522228
אוריאל ,רדי,527707121
ישראל,חייבי,542319202
מענדי ,כהן,586086033
אהרן,סברדלוב ,506522228
אופיר,רז,527814515
מנחם ,בן מעש ,544358772`;

const users = csv.split('\n').map((line, index) => {
  const [firstName, lastName, phone] = line.split(',');
  const name = `${firstName.trim()} ${lastName.trim()}`;
  return {
    id: crypto.randomBytes(8).toString('hex'),
    name: name,
    phone: `0${phone.trim()}`,
    role: 'user'
  };
});

// Remove duplicates based on phone number
const uniqueUsersMap = new Map();
users.forEach(user => {
  if (!uniqueUsersMap.has(user.phone)) {
    uniqueUsersMap.set(user.phone, user);
  }
});
const uniqueUsers = Array.from(uniqueUsersMap.values());

// Add admin user
uniqueUsers.unshift({
  id: 'admin_user_id',
  phone: '0501234567',
  name: 'גבאי ראשי',
  role: 'admin'
});


console.log(JSON.stringify(uniqueUsers, null, 2));
