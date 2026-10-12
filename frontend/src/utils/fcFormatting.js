
/**
 * FC Mobile Formatters & Utilities
 */

export function getFCPlayerName(fullName) {
  if (!fullName) return '';

  const specialMap = {
    'Vinícius Júnior': 'VINI JR.',
    'Vinicius Junior': 'VINI JR.',
    'Kevin De Bruyne': 'DE BRUYNE',
    'Frenkie de Jong': 'DE JONG',
    'Marc-André ter Stegen': 'TER STEGEN',
    'Trent Alexander-Arnold': 'A.-ARNOLD',
    'Virgil van Dijk': 'VAN DIJK',
    'Son Heung-min': 'SON',
    'Kim Min-jae': 'KIM',
    'Dani Carvajal': 'CARVAJAL',
    'Cristiano Ronaldo': 'RONALDO',
    'Lionel Messi': 'MESSI',
    'Erling Haaland': 'HAALAND',
    'Kylian Mbappé': 'MBAPPÉ',
    'Kylian Mbappe': 'MBAPPÉ',
    'Jude Bellingham': 'BELLINGHAM',
    'Federico Valverde': 'VALVERDE',
    'Antonio Rüdiger': 'RÜDIGER',
    'Ronald Araújo': 'ARAÚJO',
    'Ferland Mendy': 'MENDY',
    'Rodrygo': 'RODRYGO',
    'Mohamed Salah': 'SALAH',
    'Harry Kane': 'KANE',
    'Bukayo Saka': 'SAKA',
    'Cole Palmer': 'PALMER',
    'Lamine Yamal': 'YAMAL',
    'Bernardo Silva': 'B. SILVA',
    'Bruno Fernandes': 'FERNANDES',
    'William Saliba': 'SALIBA',
    'Declan Rice': 'RICE',
    'Florian Wirtz': 'WIRTZ',
    'Jamal Musiala': 'MUSIALA',
    'Lautaro Martínez': 'MARTÍNEZ',
    'Rafael Leão': 'LEÃO',
    'Martin Ødegaard': 'ØDEGAARD',
    'Robert Lewandowski': 'LEWANDOWSKI',
    'Antoine Griezmann': 'GRIEZMANN',
    'Phil Foden': 'FODEN',
    'Julián Alvarez': 'J. ALVAREZ',
    'Julián Álvarez': 'J. ALVAREZ',
    'Julian Alvarez': 'J. ALVAREZ',
    'Khvicha Kvaratskhelia': 'KVARATSKHELIA',
    'Eduardo Camavinga': 'CAMAVINGA',
    'Aurélien Tchouaméni': 'TCHOUAMÉNI',
    'Thibaut Courtois': 'COURTOIS',
    'Alisson Becker': 'ALISSON',
    'Ederson Moraes': 'EDERSON',
    'Gianluigi Donnarumma': 'DONNARUMMA',
    'Alejandro Garnacho': 'GARNACHO',
    'Kobbie Mainoo': 'MAINOO',
    'Arda Güler': 'GÜLER',
    'Endrick': 'ENDRICK',
    'Dani Olmo': 'OLMO',
    'Michael Olise': 'OLISE',
    'João Neves': 'J. NEVES',
    'Savinho': 'SAVINHO',
    'Sávio': 'SAVINHO',
    'Joshua Kimmich': 'KIMMICH',
    'Nicolò Barella': 'BARELLA',
    'Hakan Çalhanoğlu': 'ÇALHANOĞLU',
    'Alessandro Bastoni': 'BASTONI',
    'Federico Dimarco': 'DIMARCO',
    'Theo Hernández': 'THEO',
    'Christian Pulisic': 'PULISIC',
    'Dušan Vlahović': 'VLAHOVIĆ',
    'Kenan Yıldız': 'YILDIZ',
    'Victor Osimhen': 'OSIMHEN',
    'Alexander Isak': 'ISAK',
    'Bruno Guimarães': 'GUIMARÃES',
    'Dominic Solanke': 'SOLANKE',
    'Federico Chiesa': 'CHIESA',
    'Matthijs de Ligt': 'DE LIGT',
    'Joshua Zirkzee': 'ZIRKZEE',
    'Leny Yoro': 'YORO',
  };

  if (specialMap[fullName]) return specialMap[fullName];

  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0].toUpperCase();
  return parts[parts.length - 1].toUpperCase();
}

export function getCardTier(overall) {
  if (overall >= 86) return 'fc-tier-elite';
  if (overall >= 82) return 'fc-tier-gold';
  return 'fc-tier-silver';
}
