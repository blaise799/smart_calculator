import os
import mysql.connector
from mysql.connector import Error


def get_connection():

    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "127.0.0.1"),
            port=int(os.getenv("MYSQL_PORT", "3306")),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", "poiuytrewq"),
            database=os.getenv("MYSQL_DATABASE", "smart_calculator"),
            connection_timeout=10,
            use_pure=True
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
        print("MYSQL: Starting save...")

        connection = get_connection()

        if connection is None:
            print("MYSQL: Connection failed")
            return False

        cursor = connection.cursor()

        sql = """
            INSERT INTO calculations
            (expression, result)
            VALUES (%s, %s)
        """

        cursor.execute(
            sql,
            (str(expression), str(result))
        )

        connection.commit()

        print("MYSQL: INSERT successful")
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

        print("MYSQL: Connection closed")