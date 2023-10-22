import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import openai
import sqlite3
app = Flask(__name__)
CORS(app)
chat_memory = []
functions = [ 
        {
            "name": "classify_spendings",
            "description": "Classify miscelaneous and merchandise spending into specified categories",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": "The category of the transaction",
                    }
                },
                "required": ["category"],
            },
        }
    ]

def init():
    openai.organization = "org-lPzIpyR2eI9Mmgy9WugFvEH1"
    openai.api_key = ""
    
def categorization(transaction, category_list):
    messages = [{
        "role": "user",
        "content": "Now, read this list of possible categories:"
    }]
    messages.append({
        "role": "user",
        "content": "".join(category_list)
    })

    messages.append({
        "role": "user", 
        "content": "Read this transaction where the format is transaction date, post date, description, amount:"
    })
    messages.append({
        "role": "user",
        "content": "".join(str(transaction))
    })

    messages.append({
        "role": "system",
        "content": "Now classify that transaction into one of the categories previously listed:"
    })
    print("before create")
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        functions=functions,
        function_call={
            "name":"classify_spendings"
        }
    )
    print("after create")

    message_res = completion.choices[0].message
    fn = message_res["function_call"]
    args = json.loads(fn["arguments"])

    category = list(args.values())

    if category[0] in category_list:
        return category
    else:
        return 0




functions_budget = [ 
        {
            "name": "budget_spendings",
            "description": "Split up a specified amount of money across different specified categories to form a good budget",
            "parameters": {
                "type": "object",
                "properties": {
                },
                "required": [],
            },
        }
    ]

def ideal_budget(category_list):
    i = 0
    for cat in category_list:
        # functions_budget[0]["parameters"]["properties"]["category" + str(i)] = {"type": "string", "description": "The " + str(i) + " category of the budget"}
        functions_budget[0]["parameters"]["properties"]["money" + str(i)] = {"type": "integer", "description": "The " + str(i) + " amount of the budget"}
        # functions_budget[0]["parameters"]['required'].append("category" + str(i))
        functions_budget[0]["parameters"]['required'].append("money" + str(i))
        i+=1
    print(functions_budget)
    messages = [{
        "role": "user",
        "content": "Read this list of possible categories:"
    }]
    # messages.append({
    #     "role": "user",
    #     "content": "".join(category_list)
    # })

    messages.append({
        "role": "user", 
        "content": "Assign a percentage of my budget to spend on each category:"
    })
    # messages.append({
    #     "role": "user",
    #     "content": "".join(str(amount))
    # })

    # messages.append({
    #     "role": "user",
    #     "content": "Now build me a budget with the percent of money specified across the list of possible categories in the list with category:"
    # })
    
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        functions=functions_budget,
        function_call={
            "name":"budget_spendings"
        }
    )

    message_res = completion.choices[0].message
    fn = message_res["function_call"]
    args = json.loads(fn["arguments"])

    arguments = list(args.values())

    return arguments



@app.route('/categorization', methods=['POST'])
def call_gpt_categorization():#transaction):
    transaction = request.json['transaction']
    category_list = ["Investment", "Travel/ Entertainment", "Medicine", "Bills", "Restraunts", "Gasoline", "Supermarkets", "Services", "Savings"]
    i = 0
    found = False
    while i < 10:
        category = categorization(transaction, category_list)
        if category != 0:
            return jsonify(category)
            
        i += 1
    return jsonify("Miscellaneous")

@app.route('/category_creation', methods=['POST'])
def create_categories():
    transaction_list = request.json['category_list']
    category_set = set()
    for record in transaction_list:
        if record[4] > 0:
            if row[5] == 'Miscellaneous' or row[5] == 'Merchandise':
                row[5] = call_gpt_categorization(str(row))
            category_set.add(row[5])
    return jsonify(list(category_set))

@app.route('/budget_creation', methods=['POST'])
def call_gpt_budget():#amount, category_list= ["Investment", "Travel/ Entertainment", "Medicine", "Bills", "Restraunts", "Gasoline", "Supermarkets", "Services", "Savings"]):
    found = False
    amount = request.json['amount']
    category_list = request.json['category_list']
    default_list= ["Investment", "Travel/ Entertainment", "Medicine", "Bills", "Restraunts", "Gasoline", "Supermarkets", "Services", "Savings"]
    category_list = set(category_list)
    category_list.add("Savings")
    category_list.add("Investment")
    i = 0
    while i < 10:
        budget = []
        if i == 0:
            budget = ideal_budget(category_list)
        else:
            budget = ideal_budget([])
        
        correct_budget = True
        j = 0
        total = 0
        while j < len(budget):
            print("column: " + str(budget[j]) + " value: " + str(category_list.__contains__(budget[j])))
            # found = False
            # if category_list.__contains__(budget[j]) or default_list.__contains__(budget[j]):
            #     found = True
            # j+=1
            # if correct_budget:
            #     correct_budget = found
            total += budget[j]
            j+=1
        print(budget)
        print(total)
        if total == 100: #and correct_budget:
            return_budget = {}
            z = 0
            for value in category_list:
                return_budget[value] = budget[z] / 100 * amount
                z+=1
            return jsonify(return_budget)
            # k = 0
            # new_budget = {}
            # while k < len(budget):
            #     new_budget[budget[k]] = budget[k+1] / 100 * amount
            #     k+=2
            # return new_budget

        i+=1
    defacto_budget = {}
    # defacto_budget = []
    for cat in category_list:
        defacto_budget[cat] = (amount/len(category_list))
        
    return jsonify(defacto_budget)


functions_improvement = [ 
        {
            "name": "improve_spendings",
            "description": "Help reduce / increase spending in a specified category",
            "parameters": {
                "type": "object",
                "properties": {
                    "improvement": {
                        "type": "string",
                        "description": "The ways to improve spending in a category",
                    }
                },
                "required": ["improvement"],
            },
        }
    ]

@app.route('/improve_spendings', methods=['GET'])    
def improve_spendings():#old_amount, new_amount, category):
    old_amount = request.args.get("old_amount")
    new_amount = request.args.get("new_amount")
    category = request.args.get("category")
    messages = [{
        "role": "user",
        "content": "I spent " + str(old_amount) + " on " + category + " but I want to spend " + str(new_amount) + ":"
    }]
    messages.append({
        "role": "user", 
        "content": "What would you recommend I do to get to my desired spending amount on " + category
    })
    messages.append({
        "role": "system", 
        "content": "Give me three possible approaches:"
    })

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        functions=functions_improvement,
        function_call={
            "name":"improve_spendings"
        }
    )

    message_res = completion.choices[0].message
    fn = message_res["function_call"]
    args = json.loads(fn["arguments"])

    category = list(args.values())

    return jsonify(category[0])

functions_chatbot = [ 
        {
            "name": "chatbot",
            "description": "A chatbot that helps users budget their money in accordance to whatever they ask for",
            "parameters": {
                "type": "object",
                "properties": {
                    "response": {
                        "type": "string",
                        "description": "The response of the chatbot",
                    }
                },
                "required": ["response"],
            },
        }
    ]

@app.route('/chat', methods=['POST'])    
def chat():
    input = request.json['messages']
    messages=[]
    print("input ", input)
    if len(input) == 1:
        messages = [{
        "role": "system",
        "content": "You are a chat bot that is designed to help users budget their money in accordance to whatever they ask for:"
    }]
    print("before create")
    i = 0
    for item in input:
        messages.append({
            "role": item['role'],
            "content": item['content']
        })
        i+=1
    print(messages)

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        functions=functions_chatbot,
        function_call={
            "name":"chatbot"
        }
    )
    print("after create")

    message_res = completion.choices[0].message
    fn = message_res["function_call"]
    args = json.loads(fn["arguments"])
    messages.append({"role":"assistant", "content":list(args.values())[0]})

    return jsonify(messages[len(messages) - 1])

@app.route('/buyable_food', methods=['GET'])    
def buyable_food():
    conn = sqlite3.connect('food_database.db')
    cursor = conn.cursor()
    budget = int(request.args.get("budget"))
    query = ("SELECT * FROM meals WHERE price < " + str(budget))
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)
    

def parse_csv( file):
    df = pd.read_csv(file)
    df = df.loc[df['Amount'] > 0]
    return df
    

    

if __name__ == '__main__':
    init()
    # df = []
    # # with open('data.csv') as f:
    # df = parse_csv('data.csv')
    # sum = 0
    # temp = set()
    # for index, row in df.iterrows():

    #     sum += row['Amount']
    #     if row['Category'] == 'Miscellaneous' or row['Category'] == 'Merchandise':
    #         row['Category'] = call_gpt_categorization(str(row))
    #     print(row)
    #     temp.add(row['Category'])
    # print("temp: " + str(temp))
    # budget = call_gpt_budget(sum, temp)
    # print(budget)
    # print(improve_spendings(100, 50, "Supermarkets"))
    app.run(port=5000, debug=True)
