const moment = require("moment")
let fs = require("fs");;
const path = require("path");
module.exports =  {

    deleteFile: function (filename) {
        try {
                const deletedPath = "./public/upload/"+path.basename(filename);
                console.log("delete...",deletedPath)
                fs.unlinkSync(deletedPath)

        }catch (err) {
            console.error(err)
        }
    },

    delay: async function (resolve , timeout=3000) {
        await new Promise(resolve => setTimeout(resolve, timeout));
    },


    isdateBigger: function (startDate , endDate) {
        let isAfter = moment(startDate).isAfter(endDate);

        console.log("compare ",isAfter)
        if (isAfter) {
            return false;
        }
        return true;
    },
    getCurrentDateTimeString: function () {
        const date = new Date();
        return date.getFullYear() + '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
            date.getDate().toString().padStart(2, '0') + ':' +
            date.getHours().toString().padStart(2, '0') + ':' +
            date.getMinutes().toString().padStart(2, '0') + ':' +
            date.getSeconds().toString().padStart(2, '0');
    },

    randomnumber: function () {
        return  Math.floor((Math.random() * 999) + 9000);
    },

     randomstring:function(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
},

//1784
    //9000

    renderDate: function (date) {
        let moment = require('moment');
        const formatted = moment(date).format("YYYY-MM-DD");
        return formatted
    },

     reverseString:function(str) {
    // Step 1. Use the split() method to return a new array
    var splitString = str.toString().split(""); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]

    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]

    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"

    //Step 4. Return the reversed string
    return joinArray; // "olleh"
},
    hex2utf8: function (pStr) {
        let tempstr = ''
        try {
            tempstr = decodeURIComponent(pStr.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
        }
        catch (err) {

            for (b = 0; b < pStr.length; b = b + 2) {
                tempstr = tempstr + String.fromCharCode(parseInt(pStr.substr(b, 2), 16));
            }
        }
        return tempstr;
    },

    getlang: function (langarray) {
        const LANGLIST = [
            { "value": "aa", "display": "Afar" },
            { "value": "ab", "display": "Abkhazian" },
            { "value": "ae", "display": "Avestan" },
            { "value": "af", "display": "Afrikaans" },
            { "value": "ak", "display": "Akan" },
            { "value": "am", "display": "Amharic" },
            { "value": "an", "display": "Aragonese" },
            { "value": "ar", "display": "Arabic" },
            { "value": "as", "display": "Assamese" },
            { "value": "av", "display": "Avaric" },
            { "value": "ay", "display": "Aymara" },
            { "value": "az", "display": "Azerbaijani" },
            { "value": "ba", "display": "Bashkir" },
            { "value": "be", "display": "Belarusian" },
            { "value": "bg", "display": "Bulgarian" },
            { "value": "bh", "display": "Bihari languages" },
            { "value": "bi", "display": "Bislama" },
            { "value": "bm", "display": "Bambara" },
            { "value": "bn", "display": "Bengali" },
            { "value": "bo", "display": "Tibetan" },
            { "value": "br", "display": "Breton" },
            { "value": "bs", "display": "Bosnian" },
            { "value": "ca", "display": "Catalan; Valencian" },
            { "value": "ce", "display": "Chechen" },
            { "value": "ch", "display": "Chamorro" },
            { "value": "co", "display": "Corsican" },
            { "value": "cr", "display": "Cree" },
            { "value": "cs", "display": "Czech" },
            {
                "value": "cu",
                "display": "Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic"
            },
            { "value": "cv", "display": "Chuvash" },
            { "value": "cy", "display": "Welsh" },
            { "value": "da", "display": "Danish" },
            { "value": "de", "display": "German" },
            { "value": "dv", "display": "Divehi; Dhivehi; Maldivian" },
            { "value": "dz", "display": "Dzongkha" },
            { "value": "ee", "display": "Ewe" },
            { "value": "el", "display": "Greek, Modern (1453-)" },
            { "value": "en", "display": "English" },
            { "value": "eo", "display": "Esperanto" },
            { "value": "es", "display": "Spanish; Castilian" },
            { "value": "et", "display": "Estonian" },
            { "value": "eu", "display": "Basque" },
            { "value": "fa", "display": "Persian" },
            { "value": "ff", "display": "Fulah" },
            { "value": "fi", "display": "Finnish" },
            { "value": "fj", "display": "Fijian" },
            { "value": "fo", "display": "Faroese" },
            { "value": "fr", "display": "French" },
            { "value": "fy", "display": "Western Frisian" },
            { "value": "ga", "display": "Irish" },
            { "value": "gd", "display": "Gaelic; Scomttish Gaelic" },
            { "value": "gl", "display": "Galician" },
            { "value": "gn", "display": "Guarani" },
            { "value": "gu", "display": "Gujarati" },
            { "value": "gv", "display": "Manx" },
            { "value": "ha", "display": "Hausa" },
            { "value": "he", "display": "Hebrew" },
            { "value": "hi", "display": "Hindi" },
            { "value": "ho", "display": "Hiri Motu" },
            { "value": "hr", "display": "Croatian" },
            { "value": "ht", "display": "Haitian; Haitian Creole" },
            { "value": "hu", "display": "Hungarian" },
            { "value": "hy", "display": "Armenian" },
            { "value": "hz", "display": "Herero" },
            {
                "value": "ia",
                "display": "Interlingua (International Auxiliary Language Association)"
            },
            { "value": "id", "display": "Indonesian" },
            { "value": "ie", "display": "Interlingue; Occidental" },
            { "value": "ig", "display": "Igbo" },
            { "value": "ii", "display": "Sichuan Yi; Nuosu" },
            { "value": "ik", "display": "Inupiaq" },
            { "value": "io", "display": "Ido" },
            { "value": "is", "display": "Icelandic" },
            { "value": "it", "display": "Italian" },
            { "value": "iu", "display": "Inuktitut" },
            { "value": "ja", "display": "Japanese" },
            { "value": "jv", "display": "Javanese" },
            { "value": "ka", "display": "Georgian" },
            { "value": "kg", "display": "Kongo" },
            { "value": "ki", "display": "Kikuyu; Gikuyu" },
            { "value": "kj", "display": "Kuanyama; Kwanyama" },
            { "value": "kk", "display": "Kazakh" },
            { "value": "kl", "display": "Kalaallisut; Greenlandic" },
            { "value": "km", "display": "Central Khmer" },
            { "value": "kn", "display": "Kannada" },
            { "value": "ko", "display": "Korean" },
            { "value": "kr", "display": "Kanuri" },
            { "value": "ks", "display": "Kashmiri" },
            { "value": "ku", "display": "Kurdish" },
            { "value": "kv", "display": "Komi" },
            { "value": "kw", "display": "Cornish" },
            { "value": "ky", "display": "Kirghiz; Kyrgyz" },
            { "value": "la", "display": "Latin" },
            { "value": "lb", "display": "Luxembourgish; Letzeburgesch" },
            { "value": "lg", "display": "Ganda" },
            { "value": "li", "display": "Limburgan; Limburger; Limburgish" },
            { "value": "ln", "display": "Lingala" },
            { "value": "lo", "display": "Lao" },
            { "value": "lt", "display": "Lithuanian" },
            { "value": "lu", "display": "Luba-Katanga" },
            { "value": "lv", "display": "Latvian" },
            { "value": "mg", "display": "Malagasy" },
            { "value": "mh", "display": "Marshallese" },
            { "value": "mi", "display": "Maori" },
            { "value": "mk", "display": "Macedonian" },
            { "value": "ml", "display": "Malayalam" },
            { "value": "mn", "display": "Mongolian" },
            { "value": "mr", "display": "Marathi" },
            { "value": "ms", "display": "Malay" },
            { "value": "mt", "display": "Maltese" },
            { "value": "my", "display": "Burmese" },
            { "value": "na", "display": "Nauru" },
            {
                "value": "nb",
                "display": "Bokmål, Norwegian; Norwegian Bokmål"
            },
            { "value": "nd", "display": "Ndebele, North; North Ndebele" },
            { "value": "ne", "display": "Nepali" },
            { "value": "ng", "display": "Ndonga" },
            { "value": "nl", "display": "Dutch; Flemish" },
            { "value": "nn", "display": "Norwegian Nynorsk; Nynorsk, Norwegian" },
            { "value": "no", "display": "Norwegian" },
            { "value": "nr", "display": "Ndebele, South; South Ndebele" },
            { "value": "nv", "display": "Navajo; Navaho" },
            { "value": "ny", "display": "Chichewa; Chewa; Nyanja" },
            { "value": "oc", "display": "Occitan (post 1500)" },
            { "value": "oj", "display": "Ojibwa" },
            { "value": "om", "display": "Oromo" },
            { "value": "or", "display": "Oriya" },
            { "value": "os", "display": "Ossetian; Ossetic" },
            { "value": "pa", "display": "Panjabi; Punjabi" },
            { "value": "pi", "display": "Pali" },
            { "value": "pl", "display": "Polish" },
            { "value": "ps", "display": "Pushto; Pashto" },
            { "value": "pt", "display": "Portuguese" },
            { "value": "qu", "display": "Quechua" },
            { "value": "rm", "display": "Romansh" },
            { "value": "rn", "display": "Rundi" },
            { "value": "ro", "display": "Romanian; Moldavian; Moldovan" },
            { "value": "ru", "display": "Russian" },
            { "value": "rw", "display": "Kinyarwanda" },
            { "value": "sa", "display": "Sanskrit" },
            { "value": "sc", "display": "Sardinian" },
            { "value": "sd", "display": "Sindhi" },
            { "value": "se", "display": "Northern Sami" },
            { "value": "sg", "display": "Sango" },
            { "value": "si", "display": "Sinhala; Sinhalese" },
            { "value": "sk", "display": "Slovak" },
            { "value": "sl", "display": "Slovenian" },
            { "value": "sm", "display": "Samoan" },
            { "value": "sn", "display": "Shona" },
            { "value": "so", "display": "Somali" },
            { "value": "sq", "display": "Albanian" },
            { "value": "sr", "display": "Serbian" },
            { "value": "ss", "display": "Swati" },
            { "value": "st", "display": "Sotho, Southern" },
            { "value": "su", "display": "Sundanese" },
            { "value": "sv", "display": "Swedish" },
            { "value": "sw", "display": "Swahili" },
            { "value": "ta", "display": "Tamil" },
            { "value": "te", "display": "Telugu" },
            { "value": "tg", "display": "Tajik" },
            { "value": "th", "display": "Thai" },
            { "value": "ti", "display": "Tigrinya" },
            { "value": "tk", "display": "Turkmen" },
            { "value": "tl", "display": "Tagalog" },
            { "value": "tn", "display": "Tswana" },
            { "value": "to", "display": "Tonga (Tonga Islands)" },
            { "value": "tr", "display": "Turkish" },
            { "value": "ts", "display": "Tsonga" },
            { "value": "tt", "display": "Tatar" },
            { "value": "tw", "display": "Twi" },
            { "value": "ty", "display": "Tahitian" },
            { "value": "ug", "display": "Uighur; Uyghur" },
            { "value": "uk", "display": "Ukrainian" },
            { "value": "ur", "display": "Urdu" },
            { "value": "uz", "display": "Uzbek" },
            { "value": "ve", "display": "Venda" },
            { "value": "vi", "display": "Vietdisplayse" },
            { "value": "vo", "display": "Volapük" },
            { "value": "wa", "display": "Walloon" },
            { "value": "wo", "display": "Wolof" },
            { "value": "xh", "display": "Xhosa" },
            { "value": "yi", "display": "Yiddish" },
            { "value": "yo", "display": "Yoruba" },
            { "value": "za", "display": "Zhuang; Chuang" },
            { "value": "zh", "display": "Chinese" },
            { "value": "zu", "display": "Zulu" }
        ]


        let temp = [];
        for (b = 0; b < langarray.length; b++) {
            let onelang = LANGLIST.find(i=>i.value==langarray[b]);
            if(onelang){
                temp.push(onelang.display)
            }
        }
        return temp;
    },



};
