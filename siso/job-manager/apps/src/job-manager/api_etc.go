package main

import(
	"os"
)

// etc funcs 
// like file exist check func


func isExistFile(fname string) bool {
	if _, err := os.Stat(fname); os.IsNotExist(err) {
		return false
	}
	return true
}

/**
*	isExistFileWithSize
**/
func isExistFileWithSize(fname string) bool {

	fi, err := os.Stat(fname)

	if os.IsNotExist(err) {
		return false
	}

	if fi.Size() > 0 {
		return true
	}

	return false
}