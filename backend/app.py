from flask import Flask, request, jsonify
from flask_cors import CORS

from database import save_calculation


app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "Smart Calculator Backend is Running"
    })


@app.route("/test")
def test():
    return jsonify({
        "status": "success",
        "message": "Backend is working correctly"
    })


@app.route("/calculate", methods=["POST"])
def calculate():

    try:
        data = request.get_json()

        print("")
        print("================================")
        print("CALCULATION RECEIVED")
        print("================================")
        print("Data:", data)

        if not data:
            return jsonify({
                "success": False,
                "error": "No data received"
            }), 400

        expression = str(data.get("expression", "")).strip()
        result = data.get("result")

        if expression == "":
            return jsonify({
                "success": False,
                "error": "Expression is required"
            }), 400

        if result is None:
            return jsonify({
                "success": False,
                "error": "Result is required"
            }), 400

        # Save to MySQL
        save_calculation(
            expression,
            result
        )

        print("Expression:", expression)
        print("Result:", result)
        print("Saved successfully.")
        print("================================")
        print("")

        return jsonify({
            "success": True,
            "message": "Calculation saved successfully",
            "expression": expression,
            "result": result
        })

    except Exception as e:

        print("")
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print("BACKEND ERROR")
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print(str(e))
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print("")

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":

    print("")
    print("========================================")
    print("       SMART CALCULATOR BACKEND")
    print("========================================")
    print("")
    print("Server starting...")
    print("URL: http://127.0.0.1:5000")
    print("")
    print("DO NOT CLOSE THIS TERMINAL")
    print("")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        use_reloader=False
    )