import os
import mysql.connector
from mysql.connector import Error


def get_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE"),
            ssl_disabled=False,
            use_pure=True,
            connection_timeout=10
        )

        print("MYSQL: Connected successfully")
        return connection

    except Error as e:
        print("MYSQL CONNECTION ERROR:")
        print(e)
        return None

    except Exception as e:
        print("DATABASE ERROR:")
        print(e)
        return None


def save_calculation(expression, result):

    connection = None
    cursor = None

    try:
        connection = get_connection()

        if connection is None:
            return False

        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO calculations
            (expression, result)
            VALUES (%s, %s)
            """,
            (str(expression), str(result))
        )

        connection.commit()

        print("MYSQL: Calculation saved")
        return True

    except Error as e:
        print("MYSQL SAVE ERROR:")
        print(e)
        return False

    except Exception as e:
        print("DATABASE ERROR:")
        print(e)
        return False

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()