from flask import Flask, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)
bootstrap = Bootsrap(app)


@app.route('/')
def hello():
    return render_template('base.html')

if __name__ == '__main__':
    app.run()
