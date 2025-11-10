import tkinter as tk
from tkinter import messagebox

# создаем окно
window = tk.Tk()
window.title("Калькулятор")
window.geometry("1080x720")

# создаем текстовое поле
input1 = tk.Entry()
input1.grid(column=0, row=0)

input2 = tk.Entry()
input2.grid(column=2, row=0)

options = ["+", "-", "*", "/"]
selected_option = tk.StringVar(window)
selected_option.set(options[0])
option_menu = tk.OptionMenu(window, selected_option, *options)
option_menu.grid(column=1, row=0)


def swap_args():
    num1 = input1.get()
    num2 = input2.get()
    input2.delete(0, tk.END)
    input2.insert(0, num1)
    input1.delete(0, tk.END)
    input1.insert(0, num2)


menu = tk.Menu()
window.config(menu=menu)
file_menu = tk.Menu(menu)
menu.add_cascade(label="Файл", menu=file_menu)
file_menu.add_command(label="Выход", command=exit)
oper_menu = tk.Menu(menu)
menu.add_cascade(label="Операции", menu=oper_menu)
oper_menu.add_command(label="Поменять аргументы местами", command=swap_args)

# создаем переменную для выбранной радиокнопки
selected = tk.IntVar()
selected.set(1)

# создаем радиокнопки
radio1 = tk.Radiobutton(window, text="Калькулятор", variable=selected, value=1)
radio1.grid(column=0, row=1)

radio2 = tk.Radiobutton(window, text="Прямоугольник", variable=selected, value=2)
radio2.grid(column=0, row=2)


def validate_entry(input_num):
    value = input_num.get()
    if selected.get() == 2:  # если выбрана радиокнопка "Запретить ввод отрицательных чисел"
        if not value.isdigit() or int(value) < 0:
            # если значение не является положительным числом, то очищаем поле Entry
            input_num.delete(0, tk.END)
            # или показываем сообщение об ошибке
            # tk.messagebox.showerror("Ошибка", "Введите положительное число")
    else:
        # if not value.isfloat():
        #     input_num.delete(0, tk.END)
        try:
            float(value)
        except ValueError:
            if value != "-":
                input_num.delete(0, tk.END)


# связываем обработчик событий с полем Entry
input1.bind("<KeyRelease>", lambda event: validate_entry(input1))
input2.bind("<KeyRelease>", lambda event: validate_entry(input2))


def result():
    try:
        num1 = float(input1.get())
        num2 = float(input2.get())
    except ValueError:
        return None
    operation = selected_option.get()
    if operation == "+":
        return num1 + num2
    if operation == "-":
        return num1 - num2
    if operation == "*":
        return num1 * num2
    if operation == "/":
        if num2 != 0:
            return num1 / num2
        else:
            messagebox.showerror("Ошибка!", "На ноль делить нельзя!")
            input2.delete(0, tk.END)


result_box = tk.Label()
canvas = tk.Canvas(window, width=500, height=500)


def show_result():
    global result_box
    global canvas
    result_box.grid_forget()
    canvas.grid_forget()
    if selected.get() == 1:
        if result() is not None:
            result_box.config(text=str(round(result(), 2)))
            result_box.grid(column=4, row=0)
    else:
        try:
            canvas.grid(column=10, row=10)
            num1 = int(input1.get())
            num2 = int(input2.get())
            canvas.delete("all")
            canvas.create_rectangle(50, 50, 50 + num1, 50 + num2)
            result_box.config(text=f"S = {num1 * num2}\nP = {num1 * 2 + num2 * 2}")
            result_box.grid(column=0, row=5)
        except ValueError:
            pass


# создаем кнопку
button = tk.Button(text="=", command=show_result)
button.grid(column=3, row=0)

# запускаем главный цикл обработки событий
if __name__ == "__main__":
    window.mainloop()

