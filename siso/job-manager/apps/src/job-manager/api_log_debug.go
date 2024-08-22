

package main

import (
	"log"
	"os"
	"fmt"
	"time"
)

var (
	INFO  func(v ...interface{})
	DEBUG func(v ...interface{})
	TRACE func(v ...interface{})
)


var (
	infoMode  bool = false
	debugMode bool = false
	traceMode bool = false
)

func init() {
	log.SetFlags(0)
	log.SetOutput(os.Stdout)

	INFO = emptyPrint
	DEBUG = emptyPrint
	TRACE = emptyPrint
}

func emptyPrint(v ...interface{}) {
}

func setDebugMode() {

	if infoMode {
		INFO = func(v ...interface{}) {
			logWithPrefix("INFO", v...)
		}
	}

	if debugMode {
		DEBUG = func(v ...interface{}) {
			logWithPrefix("DEBUG", v...)
		}
	}

	if traceMode {
		TRACE = func(v ...interface{}) {
			logWithPrefix("TRACE", v...)
		}
	}
}

func logWithPrefix(level string, v ...interface{}) {
	fmt.Printf("[%s] %s: ", time.Now().Format("06-01-02-15:04:05.00"), level)
	log.Println(v...)
}