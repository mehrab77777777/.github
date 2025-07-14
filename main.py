import kivy
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.spinner import Spinner
from kivy.properties import StringProperty, NumericProperty

kivy.require('2.0.0')

class Game(BoxLayout):
    کشور_بازیکن = StringProperty('ایران')
    پول = NumericProperty(1000)
    ارتش = NumericProperty(100)
    فناوری = NumericProperty(50)
    سال = NumericProperty(2027)
    پیام = StringProperty('به بازی امپراطوری خوش آمدید!')

    def انتخاب_کشور(self, کشور):
        self.کشور_بازیکن = کشور
        self.پیام = f'کشور شما: {کشور}'

    def حمله(self):
        if self.ارتش >= 20:
            self.ارتش -= 20
            self.پول += 200
            self.پیام = 'حمله موفق! ۲۰ ارتش کم شد و ۲۰۰ پول گرفتید.'
        else:
            self.پیام = 'ارتش کافی ندارید!'

    def دیپلماسی(self):
        self.فناوری += 10
        self.پیام = 'دیپلماسی موفق! ۱۰ فناوری اضافه شد.'

    def سال_بعد(self):
        self.سال += 1
        self.پول += 100
        self.ارتش += 10
        self.پیام = f'سال {self.سال} رسید. منابع افزایش یافت.'

class EmpireApp(App):
    def build(self):
        return Game()

if __name__ == '__main__':
    EmpireApp().run()