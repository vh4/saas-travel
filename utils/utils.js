const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    getIdOutlet:async function(token){

        const response = await fetch(`${process.env.URL_HIT}/travel/app/account`, {
            method: 'post',
            body: JSON.stringify({token:token}),
            headers: {'Content-Type': 'application/json'}
        });
    
        const data = await response.json();
        return data.data.idOutlet;
    },

    getCountry: function(){
        const data = // 20231113150209
        // https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code
        
        {
          "userCountryCode": "ID",
          "countries": [
            {
              "value": "AW",
              "label": "🇦🇼 Aruba"
            },
            {
              "value": "AF",
              "label": "🇦🇫 Afghanistan"
            },
            {
              "value": "AO",
              "label": "🇦🇴 Angola"
            },
            {
              "value": "AI",
              "label": "🇦🇮 Anguilla"
            },
            {
              "value": "AX",
              "label": "🇦🇽 Åland Islands"
            },
            {
              "value": "AL",
              "label": "🇦🇱 Albania"
            },
            {
              "value": "AD",
              "label": "🇦🇩 Andorra"
            },
            {
              "value": "AE",
              "label": "🇦🇪 United Arab Emirates"
            },
            {
              "value": "AR",
              "label": "🇦🇷 Argentina"
            },
            {
              "value": "AM",
              "label": "🇦🇲 Armenia"
            },
            {
              "value": "AS",
              "label": "🇦🇸 American Samoa"
            },
            {
              "value": "AQ",
              "label": "🇦🇶 Antarctica"
            },
            {
              "value": "TF",
              "label": "🇹🇫 French Southern and Antarctic Lands"
            },
            {
              "value": "AG",
              "label": "🇦🇬 Antigua and Barbuda"
            },
            {
              "value": "AU",
              "label": "🇦🇺 Australia"
            },
            {
              "value": "AT",
              "label": "🇦🇹 Austria"
            },
            {
              "value": "AZ",
              "label": "🇦🇿 Azerbaijan"
            },
            {
              "value": "BI",
              "label": "🇧🇮 Burundi"
            },
            {
              "value": "BE",
              "label": "🇧🇪 Belgium"
            },
            {
              "value": "BJ",
              "label": "🇧🇯 Benin"
            },
            {
              "value": "BF",
              "label": "🇧🇫 Burkina Faso"
            },
            {
              "value": "BD",
              "label": "🇧🇩 Bangladesh"
            },
            {
              "value": "BG",
              "label": "🇧🇬 Bulgaria"
            },
            {
              "value": "BH",
              "label": "🇧🇭 Bahrain"
            },
            {
              "value": "BS",
              "label": "🇧🇸 Bahamas"
            },
            {
              "value": "BA",
              "label": "🇧🇦 Bosnia and Herzegovina"
            },
            {
              "value": "BL",
              "label": "🇧🇱 Saint Barthélemy"
            },
            {
              "value": "SH",
              "label": "🇸🇭 Saint Helena, Ascension and Tristan da Cunha"
            },
            {
              "value": "BY",
              "label": "🇧🇾 Belarus"
            },
            {
              "value": "BZ",
              "label": "🇧🇿 Belize"
            },
            {
              "value": "BM",
              "label": "🇧🇲 Bermuda"
            },
            {
              "value": "BO",
              "label": "🇧🇴 Bolivia"
            },
            {
              "value": "BQ",
              "label": " Caribbean Netherlands"
            },
            {
              "value": "BR",
              "label": "🇧🇷 Brazil"
            },
            {
              "value": "BB",
              "label": "🇧🇧 Barbados"
            },
            {
              "value": "BN",
              "label": "🇧🇳 Brunei"
            },
            {
              "value": "BT",
              "label": "🇧🇹 Bhutan"
            },
            {
              "value": "BV",
              "label": "🇧🇻 Bouvet Island"
            },
            {
              "value": "BW",
              "label": "🇧🇼 Botswana"
            },
            {
              "value": "CF",
              "label": "🇨🇫 Central African Republic"
            },
            {
              "value": "CA",
              "label": "🇨🇦 Canada"
            },
            {
              "value": "CC",
              "label": "🇨🇨 Cocos (Keeling) Islands"
            },
            {
              "value": "CH",
              "label": "🇨🇭 Switzerland"
            },
            {
              "value": "CL",
              "label": "🇨🇱 Chile"
            },
            {
              "value": "CN",
              "label": "🇨🇳 China"
            },
            {
              "value": "CI",
              "label": "🇨🇮 Ivory Coast"
            },
            {
              "value": "CM",
              "label": "🇨🇲 Cameroon"
            },
            {
              "value": "CD",
              "label": "🇨🇩 DR Congo"
            },
            {
              "value": "CG",
              "label": "🇨🇬 Republic of the Congo"
            },
            {
              "value": "CK",
              "label": "🇨🇰 Cook Islands"
            },
            {
              "value": "CO",
              "label": "🇨🇴 Colombia"
            },
            {
              "value": "KM",
              "label": "🇰🇲 Comoros"
            },
            {
              "value": "CV",
              "label": "🇨🇻 Cape Verde"
            },
            {
              "value": "CR",
              "label": "🇨🇷 Costa Rica"
            },
            {
              "value": "CU",
              "label": "🇨🇺 Cuba"
            },
            {
              "value": "CW",
              "label": "🇨🇼 Curaçao"
            },
            {
              "value": "CX",
              "label": "🇨🇽 Christmas Island"
            },
            {
              "value": "KY",
              "label": "🇰🇾 Cayman Islands"
            },
            {
              "value": "CY",
              "label": "🇨🇾 Cyprus"
            },
            {
              "value": "CZ",
              "label": "🇨🇿 Czechia"
            },
            {
              "value": "DE",
              "label": "🇩🇪 Germany"
            },
            {
              "value": "DJ",
              "label": "🇩🇯 Djibouti"
            },
            {
              "value": "DM",
              "label": "🇩🇲 Dominica"
            },
            {
              "value": "DK",
              "label": "🇩🇰 Denmark"
            },
            {
              "value": "DO",
              "label": "🇩🇴 Dominican Republic"
            },
            {
              "value": "DZ",
              "label": "🇩🇿 Algeria"
            },
            {
              "value": "EC",
              "label": "🇪🇨 Ecuador"
            },
            {
              "value": "EG",
              "label": "🇪🇬 Egypt"
            },
            {
              "value": "ER",
              "label": "🇪🇷 Eritrea"
            },
            {
              "value": "EH",
              "label": "🇪🇭 Western Sahara"
            },
            {
              "value": "ES",
              "label": "🇪🇸 Spain"
            },
            {
              "value": "EE",
              "label": "🇪🇪 Estonia"
            },
            {
              "value": "ET",
              "label": "🇪🇹 Ethiopia"
            },
            {
              "value": "FI",
              "label": "🇫🇮 Finland"
            },
            {
              "value": "FJ",
              "label": "🇫🇯 Fiji"
            },
            {
              "value": "FK",
              "label": "🇫🇰 Falkland Islands"
            },
            {
              "value": "FR",
              "label": "🇫🇷 France"
            },
            {
              "value": "FO",
              "label": "🇫🇴 Faroe Islands"
            },
            {
              "value": "FM",
              "label": "🇫🇲 Micronesia"
            },
            {
              "value": "GA",
              "label": "🇬🇦 Gabon"
            },
            {
              "value": "GB",
              "label": "🇬🇧 United Kingdom"
            },
            {
              "value": "GE",
              "label": "🇬🇪 Georgia"
            },
            {
              "value": "GG",
              "label": "🇬🇬 Guernsey"
            },
            {
              "value": "GH",
              "label": "🇬🇭 Ghana"
            },
            {
              "value": "GI",
              "label": "🇬🇮 Gibraltar"
            },
            {
              "value": "GN",
              "label": "🇬🇳 Guinea"
            },
            {
              "value": "GP",
              "label": "🇬🇵 Guadeloupe"
            },
            {
              "value": "GM",
              "label": "🇬🇲 Gambia"
            },
            {
              "value": "GW",
              "label": "🇬🇼 Guinea-Bissau"
            },
            {
              "value": "GQ",
              "label": "🇬🇶 Equatorial Guinea"
            },
            {
              "value": "GR",
              "label": "🇬🇷 Greece"
            },
            {
              "value": "GD",
              "label": "🇬🇩 Grenada"
            },
            {
              "value": "GL",
              "label": "🇬🇱 Greenland"
            },
            {
              "value": "GT",
              "label": "🇬🇹 Guatemala"
            },
            {
              "value": "GF",
              "label": "🇬🇫 French Guiana"
            },
            {
              "value": "GU",
              "label": "🇬🇺 Guam"
            },
            {
              "value": "GY",
              "label": "🇬🇾 Guyana"
            },
            {
              "value": "HK",
              "label": "🇭🇰 Hong Kong"
            },
            {
              "value": "HM",
              "label": "🇭🇲 Heard Island and McDonald Islands"
            },
            {
              "value": "HN",
              "label": "🇭🇳 Honduras"
            },
            {
              "value": "HR",
              "label": "🇭🇷 Croatia"
            },
            {
              "value": "HT",
              "label": "🇭🇹 Haiti"
            },
            {
              "value": "HU",
              "label": "🇭🇺 Hungary"
            },
            {
              "value": "ID",
              "label": "🇮🇩 Indonesia"
            },
            {
              "value": "IM",
              "label": "🇮🇲 Isle of Man"
            },
            {
              "value": "IN",
              "label": "🇮🇳 India"
            },
            {
              "value": "IO",
              "label": "🇮🇴 British Indian Ocean Territory"
            },
            {
              "value": "IE",
              "label": "🇮🇪 Ireland"
            },
            {
              "value": "IR",
              "label": "🇮🇷 Iran"
            },
            {
              "value": "IQ",
              "label": "🇮🇶 Iraq"
            },
            {
              "value": "IS",
              "label": "🇮🇸 Iceland"
            },
            {
              "value": "IL",
              "label": "🇮🇱 Israel"
            },
            {
              "value": "IT",
              "label": "🇮🇹 Italy"
            },
            {
              "value": "JM",
              "label": "🇯🇲 Jamaica"
            },
            {
              "value": "JE",
              "label": "🇯🇪 Jersey"
            },
            {
              "value": "JO",
              "label": "🇯🇴 Jordan"
            },
            {
              "value": "JP",
              "label": "🇯🇵 Japan"
            },
            {
              "value": "KZ",
              "label": "🇰🇿 Kazakhstan"
            },
            {
              "value": "KE",
              "label": "🇰🇪 Kenya"
            },
            {
              "value": "KG",
              "label": "🇰🇬 Kyrgyzstan"
            },
            {
              "value": "KH",
              "label": "🇰🇭 Cambodia"
            },
            {
              "value": "KI",
              "label": "🇰🇮 Kiribati"
            },
            {
              "value": "KN",
              "label": "🇰🇳 Saint Kitts and Nevis"
            },
            {
              "value": "KR",
              "label": "🇰🇷 South Korea"
            },
            {
              "value": "XK",
              "label": "🇽🇰 Kosovo"
            },
            {
              "value": "KW",
              "label": "🇰🇼 Kuwait"
            },
            {
              "value": "LA",
              "label": "🇱🇦 Laos"
            },
            {
              "value": "LB",
              "label": "🇱🇧 Lebanon"
            },
            {
              "value": "LR",
              "label": "🇱🇷 Liberia"
            },
            {
              "value": "LY",
              "label": "🇱🇾 Libya"
            },
            {
              "value": "LC",
              "label": "🇱🇨 Saint Lucia"
            },
            {
              "value": "LI",
              "label": "🇱🇮 Liechtenstein"
            },
            {
              "value": "LK",
              "label": "🇱🇰 Sri Lanka"
            },
            {
              "value": "LS",
              "label": "🇱🇸 Lesotho"
            },
            {
              "value": "LT",
              "label": "🇱🇹 Lithuania"
            },
            {
              "value": "LU",
              "label": "🇱🇺 Luxembourg"
            },
            {
              "value": "LV",
              "label": "🇱🇻 Latvia"
            },
            {
              "value": "MO",
              "label": "🇲🇴 Macau"
            },
            {
              "value": "MF",
              "label": "🇲🇫 Saint Martin"
            },
            {
              "value": "MA",
              "label": "🇲🇦 Morocco"
            },
            {
              "value": "MC",
              "label": "🇲🇨 Monaco"
            },
            {
              "value": "MD",
              "label": "🇲🇩 Moldova"
            },
            {
              "value": "MG",
              "label": "🇲🇬 Madagascar"
            },
            {
              "value": "MV",
              "label": "🇲🇻 Maldives"
            },
            {
              "value": "MX",
              "label": "🇲🇽 Mexico"
            },
            {
              "value": "MH",
              "label": "🇲🇭 Marshall Islands"
            },
            {
              "value": "MK",
              "label": "🇲🇰 North Macedonia"
            },
            {
              "value": "ML",
              "label": "🇲🇱 Mali"
            },
            {
              "value": "MT",
              "label": "🇲🇹 Malta"
            },
            {
              "value": "MM",
              "label": "🇲🇲 Myanmar"
            },
            {
              "value": "ME",
              "label": "🇲🇪 Montenegro"
            },
            {
              "value": "MN",
              "label": "🇲🇳 Mongolia"
            },
            {
              "value": "MP",
              "label": "🇲🇵 Northern Mariana Islands"
            },
            {
              "value": "MZ",
              "label": "🇲🇿 Mozambique"
            },
            {
              "value": "MR",
              "label": "🇲🇷 Mauritania"
            },
            {
              "value": "MS",
              "label": "🇲🇸 Montserrat"
            },
            {
              "value": "MQ",
              "label": "🇲🇶 Martinique"
            },
            {
              "value": "MU",
              "label": "🇲🇺 Mauritius"
            },
            {
              "value": "MW",
              "label": "🇲🇼 Malawi"
            },
            {
              "value": "MY",
              "label": "🇲🇾 Malaysia"
            },
            {
              "value": "YT",
              "label": "🇾🇹 Mayotte"
            },
            {
              "value": "NA",
              "label": "🇳🇦 Namibia"
            },
            {
              "value": "NC",
              "label": "🇳🇨 New Caledonia"
            },
            {
              "value": "NE",
              "label": "🇳🇪 Niger"
            },
            {
              "value": "NF",
              "label": "🇳🇫 Norfolk Island"
            },
            {
              "value": "NG",
              "label": "🇳🇬 Nigeria"
            },
            {
              "value": "NI",
              "label": "🇳🇮 Nicaragua"
            },
            {
              "value": "NU",
              "label": "🇳🇺 Niue"
            },
            {
              "value": "NL",
              "label": "🇳🇱 Netherlands"
            },
            {
              "value": "NO",
              "label": "🇳🇴 Norway"
            },
            {
              "value": "NP",
              "label": "🇳🇵 Nepal"
            },
            {
              "value": "NR",
              "label": "🇳🇷 Nauru"
            },
            {
              "value": "NZ",
              "label": "🇳🇿 New Zealand"
            },
            {
              "value": "OM",
              "label": "🇴🇲 Oman"
            },
            {
              "value": "PK",
              "label": "🇵🇰 Pakistan"
            },
            {
              "value": "PA",
              "label": "🇵🇦 Panama"
            },
            {
              "value": "PN",
              "label": "🇵🇳 Pitcairn Islands"
            },
            {
              "value": "PE",
              "label": "🇵🇪 Peru"
            },
            {
              "value": "PH",
              "label": "🇵🇭 Philippines"
            },
            {
              "value": "PW",
              "label": "🇵🇼 Palau"
            },
            {
              "value": "PG",
              "label": "🇵🇬 Papua New Guinea"
            },
            {
              "value": "PL",
              "label": "🇵🇱 Poland"
            },
            {
              "value": "PR",
              "label": "🇵🇷 Puerto Rico"
            },
            {
              "value": "KP",
              "label": "🇰🇵 North Korea"
            },
            {
              "value": "PT",
              "label": "🇵🇹 Portugal"
            },
            {
              "value": "PY",
              "label": "🇵🇾 Paraguay"
            },
            {
              "value": "PS",
              "label": "🇵🇸 Palestine"
            },
            {
              "value": "PF",
              "label": "🇵🇫 French Polynesia"
            },
            {
              "value": "QA",
              "label": "🇶🇦 Qatar"
            },
            {
              "value": "RE",
              "label": "🇷🇪 Réunion"
            },
            {
              "value": "RO",
              "label": "🇷🇴 Romania"
            },
            {
              "value": "RU",
              "label": "🇷🇺 Russia"
            },
            {
              "value": "RW",
              "label": "🇷🇼 Rwanda"
            },
            {
              "value": "SA",
              "label": "🇸🇦 Saudi Arabia"
            },
            {
              "value": "SD",
              "label": "🇸🇩 Sudan"
            },
            {
              "value": "SN",
              "label": "🇸🇳 Senegal"
            },
            {
              "value": "SG",
              "label": "🇸🇬 Singapore"
            },
            {
              "value": "GS",
              "label": "🇬🇸 South Georgia"
            },
            {
              "value": "SJ",
              "label": "🇸🇯 Svalbard and Jan Mayen"
            },
            {
              "value": "SB",
              "label": "🇸🇧 Solomon Islands"
            },
            {
              "value": "SL",
              "label": "🇸🇱 Sierra Leone"
            },
            {
              "value": "SV",
              "label": "🇸🇻 El Salvador"
            },
            {
              "value": "SM",
              "label": "🇸🇲 San Marino"
            },
            {
              "value": "SO",
              "label": "🇸🇴 Somalia"
            },
            {
              "value": "PM",
              "label": "🇵🇲 Saint Pierre and Miquelon"
            },
            {
              "value": "RS",
              "label": "🇷🇸 Serbia"
            },
            {
              "value": "SS",
              "label": "🇸🇸 South Sudan"
            },
            {
              "value": "ST",
              "label": "🇸🇹 São Tomé and Príncipe"
            },
            {
              "value": "SR",
              "label": "🇸🇷 Suriname"
            },
            {
              "value": "SK",
              "label": "🇸🇰 Slovakia"
            },
            {
              "value": "SI",
              "label": "🇸🇮 Slovenia"
            },
            {
              "value": "SE",
              "label": "🇸🇪 Sweden"
            },
            {
              "value": "SZ",
              "label": "🇸🇿 Eswatini"
            },
            {
              "value": "SX",
              "label": "🇸🇽 Sint Maarten"
            },
            {
              "value": "SC",
              "label": "🇸🇨 Seychelles"
            },
            {
              "value": "SY",
              "label": "🇸🇾 Syria"
            },
            {
              "value": "TC",
              "label": "🇹🇨 Turks and Caicos Islands"
            },
            {
              "value": "TD",
              "label": "🇹🇩 Chad"
            },
            {
              "value": "TG",
              "label": "🇹🇬 Togo"
            },
            {
              "value": "TH",
              "label": "🇹🇭 Thailand"
            },
            {
              "value": "TJ",
              "label": "🇹🇯 Tajikistan"
            },
            {
              "value": "TK",
              "label": "🇹🇰 Tokelau"
            },
            {
              "value": "TM",
              "label": "🇹🇲 Turkmenistan"
            },
            {
              "value": "TL",
              "label": "🇹🇱 Timor-Leste"
            },
            {
              "value": "TO",
              "label": "🇹🇴 Tonga"
            },
            {
              "value": "TT",
              "label": "🇹🇹 Trinidad and Tobago"
            },
            {
              "value": "TN",
              "label": "🇹🇳 Tunisia"
            },
            {
              "value": "TR",
              "label": "🇹🇷 Turkey"
            },
            {
              "value": "TV",
              "label": "🇹🇻 Tuvalu"
            },
            {
              "value": "TW",
              "label": "🇹🇼 Taiwan"
            },
            {
              "value": "TZ",
              "label": "🇹🇿 Tanzania"
            },
            {
              "value": "UG",
              "label": "🇺🇬 Uganda"
            },
            {
              "value": "UA",
              "label": "🇺🇦 Ukraine"
            },
            {
              "value": "UM",
              "label": "🇺🇲 United States Minor Outlying Islands"
            },
            {
              "value": "UY",
              "label": "🇺🇾 Uruguay"
            },
            {
              "value": "US",
              "label": "🇺🇸 United States"
            },
            {
              "value": "UZ",
              "label": "🇺🇿 Uzbekistan"
            },
            {
              "value": "VA",
              "label": "🇻🇦 Vatican City"
            },
            {
              "value": "VC",
              "label": "🇻🇨 Saint Vincent and the Grenadines"
            },
            {
              "value": "VE",
              "label": "🇻🇪 Venezuela"
            },
            {
              "value": "VG",
              "label": "🇻🇬 British Virgin Islands"
            },
            {
              "value": "VI",
              "label": "🇻🇮 United States Virgin Islands"
            },
            {
              "value": "VN",
              "label": "🇻🇳 Vietnam"
            },
            {
              "value": "VU",
              "label": "🇻🇺 Vanuatu"
            },
            {
              "value": "WF",
              "label": "🇼🇫 Wallis and Futuna"
            },
            {
              "value": "WS",
              "label": "🇼🇸 Samoa"
            },
            {
              "value": "YE",
              "label": "🇾🇪 Yemen"
            },
            {
              "value": "ZA",
              "label": "🇿🇦 South Africa"
            },
            {
              "value": "ZM",
              "label": "🇿🇲 Zambia"
            },
            {
              "value": "ZW",
              "label": "🇿🇼 Zimbabwe"
            }
          ],
          "userSelectValue": {
            "value": "ID",
            "label": "🇮🇩 Indonesia"
          }
        }

        return data;
    }
};