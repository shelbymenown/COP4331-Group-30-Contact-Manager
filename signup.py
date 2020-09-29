from flask import Flask
from flask_restful import Resource, Api
from flask_restful import reqparse
from flaskext.mysql import MySQL

mysql = MySQL()
app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'cop4311g_30'
app.config['MYSQL_DATABASE_PASSWORD'] = 'Copcop24!!'
app.config['MYSQL_DATABASE_DB'] = 'cop4311g_contactmanager'
app.config['MYSQL_DATABASE_HOST'] = '107.180.101.140'

mysql.init_app(app)

api = Api(app)

class CreateUser(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('name', type=str, help='Name to create user')
            parser.add_argument('username', type=str, help='Username to create user')
            parser.add_argument('password', type=str, help='Password')
            args = parser.parse_args()

            _userFullName = args['name']
            _userName = args['username']
            _userPassword = args['password']

            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.callproc('spCreateUser',(_userFullName,_userName,_userPassword))
            data = cursor.fetchall()

            if len(data) == 0:
                conn.commit()
                return {'StatusCode':'200','Message': 'User creation success'}
            else:
                return {'StatusCode':'1000','Message': str(data[0])}

        except Exception as e:
            return {'error': str(e)}




api.add_resource(CreateUser, '/CreateUser')
if __name__ == '__main__':
    app.run(debug=True)
