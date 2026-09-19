def calculate(num1, operator, num2):

    if operator == "+":
        return num1 + num2

    elif operator == "-":
        return num1 - num2

    elif operator == "*":
        return num1 * num2

    elif operator == "/":
        if num2 == 0:
            return "Cannot divide by zero"

        return num1 / num2

    else:
        return "Invalid operator"