package main

import (
	"os"
	"os/signal"
	"time"
)

type Singal struct {
	interrupt chan os.Signal
	fnClose   []func()
}

func CreateSignal() *Singal {

	sig := new(Singal)
	sig.interrupt = make(chan os.Signal, 1)
	signal.Notify(sig.interrupt, os.Interrupt)

	return sig
}

func (sig *Singal) SetCloseCall(fn func()) {
	sig.fnClose = append(sig.fnClose, fn)
}

func (sig *Singal) WaitLoop(secCallFn func()) {
	for {
		select {
		case <-time.After(1 * time.Second):
			if secCallFn != nil {
				secCallFn()
			}
		case <-sig.interrupt:
			INFO("interrupt")
			for _, fn := range sig.fnClose {
				if fn != nil {
					fn()
				}
			}
			os.Exit(3)
		}
	}
}
