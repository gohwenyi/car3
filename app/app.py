from flask import Flask, render_template, request
import numpy as np
import pandas as pd
from joblib import load
import os

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def hello_world():
    request_type_str = request.method
    if request_type_str == 'GET':
        return render_template('index.html', href2='static/none.png', href3='')
    else:
        myage = request.form['age']
        mygender = request.form['salary']
        mycar = ''
        if str(myage) =='' or str(mygender) =='':
            return render_template('index.html', href2='static/none.png', href3='Please insert your age and gender.')
        else:
            model = load('app/car-recommender.joblib')
            np_arr = np.array([myage, mygender])
            predictions = model.predict([np_arr])  
            predictions_to_str = str(predictions)
            
            if 'CUV' in predictions_to_str:
                mycar = 'static/CUV.png'
            elif 'Micro' in predictions_to_str:
                mycar = 'static/Micro.png'
            elif 'Sedan' in predictions_to_str:
                mycar = 'static/Sedan.png'
            elif 'SUV' in predictions_to_str:
                mycar = 'static/SUV.png'
            else:
                mycar = 'static/none.png'
 
                
            return render_template('index.html', href2=str(mybread), href3='This is the recommendation! (age:'+str(myage)+' ,gender:'+str(mygender)+') is:'+predictions_to_str)
        
