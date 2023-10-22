import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import openai
app = Flask(__name__)
# CORS(app)

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
    openai.api_key = "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"
    
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
        "content": "".join(transaction)
    })

    messages.append({
        "role": "user",
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

def ideal_budget(amount, category_list):
    i = 0
    for cat in category_list:
        functions_budget[0]["parameters"]["properties"]["category" + str(i)] = {"type": "string", "description": "The " + str(i) + " category of the budget"}
        functions_budget[0]["parameters"]["properties"]["money" + str(i)] = {"type": "integer", "description": "The " + str(i) + " amount of the budget"}
        functions_budget[0]["parameters"]['required'].append("category" + str(i))
        functions_budget[0]["parameters"]['required'].append("money" + str(i))
        i+=1
    print(functions_budget)
    messages = [{
        "role": "user",
        "content": "Read this list of possible categories:"
    }]
    messages.append({
        "role": "user",
        "content": "".join(category_list)
    })

    messages.append({
        "role": "user", 
        "content": "This is the amount of money that I have to budget:"
    })
    messages.append({
        "role": "user",
        "content": "".join(str(amount))
    })

    messages.append({
        "role": "user",
        "content": "Now build me a budget with the percent of money specified across the list of possible categories in the list with category:"
    })
    
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

def call_gpt_categorization(transaction):
    category_list = ["Investment", "Travel/ Entertainment", "Medicine", "Bills", "Restraunts", "Gasoline", "Supermarkets", "Services", "Savings"]
    i = 0
    found = False
    while i < 10:
        category = categorization(transaction, category_list)
        if category != 0:
            return category
            
        i += 1
    return "Miscellaneous"
    return category

def call_gpt_budget(amount, category_list= ["Investment", "Travel/ Entertainment", "Medicine", "Bills", "Restraunts", "Gasoline", "Supermarkets", "Services", "Savings"]):
    found = False
    default_list= ["Investment", "Travel/ Entertainment", "Medicine", "Bills", "Restraunts", "Gasoline", "Supermarkets", "Services", "Savings"]
    i = 0
    while i < 10:
        budget = []
        if i == 0:
            budget = ideal_budget(amount, category_list)
        else:
            budget = ideal_budget(amount, [])
        
        correct_budget = True
        j = 0
        sum = 0
        while j < len(budget):
            print("column: " + str(budget[j]) + " value: " + str(category_list.__contains__(budget[j])))
            found = False
            if category_list.__contains__(budget[j]) or default_list.__contains__(budget[j]):
                found = True
            j+=1
            if correct_budget:
                correct_budget = found
            sum += budget[j]
            j+=1
        print(budget)
        print(sum)
        if sum == 100 and correct_budget:
            k = 0
            new_budget = {}
            while k < len(budget):
                new_budget[budget[k]] = budget[k+1] / 100 * amount
                k+=2
            return new_budget

        i+=1
    defacto_budget = {}
    for cat in category_list:
        defacto_budget[cat] = amount/len(category_list)

    return defacto_budget


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
    
def improve_spendings(old_amount, new_amount, category):
    messages = [{
        "role": "user",
        "content": "I spent " + str(old_amount) + " on " + category + " but I want to spend " + str(new_amount) + ":"
    }]
    messages.append({
        "role": "user", 
        "content": "What would you recommend I do to get to my desired spending amount on " + category
    })
    messages.append({
        "role": "user", 
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

    return category[0]



def parse_csv( file):
    df = pd.read_csv(file)
    df = df.loc[df['Amount'] > 0]
    return df
    
    

if __name__ == '__main__':
    init()
    df = []
    # with open('data.csv') as f:
    df = parse_csv('data.csv')
    sum = 0
    temp = set()
    for index, row in df.iterrows():

        sum += row['Amount']
        if row['Category'] == 'Miscellaneous' or row['Category'] == 'Merchandise':
            row['Category'] = call_gpt_categorization(str(row))
        print(row)
        temp.add(row['Category'])
    print("temp: " + str(temp))
    budget = call_gpt_budget(sum, temp)
    print(budget)
    print(improve_spendings(100, 50, "Supermarkets"))
    # app.run(port=5000, debug=True)
