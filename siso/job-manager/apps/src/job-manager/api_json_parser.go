package main

import (
	"github.com/tidwall/gjson"

	"strings"
)

func Jsoncmdparser(rxdata string) string {
	rxcmd := gjson.Get(rxdata, "cmd")
	return rxcmd.Str
}

func Jsonstrdataparser(rxdata string, keydata string) string {
	val := gjson.Get(rxdata, keydata)

	if !val.Exists() {
		DEBUG("[parser]There are no key "+keydata + " in " + rxdata)
	}

	return val.Str
}


func JsonstrAdataparser(rxdata string, keydata string) string {
	val := gjson.Get(rxdata, keydata).Array()

	// if !val.Exists() {
	// 	DEBUG("[parser]There are no key in " + rxdata)
	// }
	var tmpstr []string
	for _, v := range val {
		tmpstr = append(tmpstr, v.String())
	}

	valstr := strings.Join(tmpstr," ")
	return valstr
}


func Jsonintdataparser(rxdata string, keydata string) int {
	val := gjson.Get(rxdata, keydata)

	if !val.Exists() {
		DEBUG("[parser]There are no key "+keydata + " in " + rxdata)
	}

	return int(val.Num)
}

func json_float_data_parser(rxdata string, keydata string) float64 {
	val := gjson.Get(rxdata, keydata)

	if !val.Exists() {
		DEBUG("[parser]There are no key "+keydata + " in " + rxdata)
	}

	return val.Num
}
