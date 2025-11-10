import tkinter as tk
import main


def test_result_addition():
    # проверка сложения
    main.input1.delete(0, tk.END)
    main.input1.insert(0, "5")
    main.input2.delete(0, tk.END)
    main.input2.insert(0, "3")
    main.selected_option.set("+")
    assert main.result() == 8.0


def test_result_division_by_zero():
    # проверка деления на ноль
    main.input1.delete(0, tk.END)
    main.input1.insert(0, "10")
    main.input2.delete(0, tk.END)
    main.input2.insert(0, "0")
    main.selected_option.set("/")
    assert main.result() is None


def test_swap_args():
    # проверка что аргументы меняются местами
    main.input1.delete(0, tk.END)
    main.input1.insert(0, "1")
    main.input2.delete(0, tk.END)
    main.input2.insert(0, "2")
    main.swap_args()
    assert main.input1.get() == "2"
    assert main.input2.get() == "1"


def test_validate_entry_rectangle_mode():
    # в режиме прямоугольника отрицательные числа запрещены
    main.selected.set(2)
    entry = tk.Entry()
    entry.insert(0, "-5")
    main.validate_entry(entry)
    assert entry.get() == ""


def test_validate_entry_calculator_mode():
    # в режиме калькулятора строки очищаются при неверном вводе
    main.selected.set(1)
    entry = tk.Entry()
    entry.insert(0, "abc")
    main.validate_entry(entry)
    assert entry.get() == ""
