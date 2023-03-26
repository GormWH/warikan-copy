def getmin(arr):
    min_index = 0
    for i in range(1, len(arr)):
        if (arr[i] < arr[min_index]):
            min_index = i
    return min_index

def getmax(arr):
    max_index = 0
    for i in range(1, len(arr)):
        if (arr[i] > arr[max_index]):
            max_index = i
    return max_index
 
def min_of_2(x, y):
    return x if x < y else y
 
def optimize_cash_flow(amount, payment_list):
    max_credit = getmax(amount)
    max_debit = getmin(amount)

    if (amount[max_credit] == 0 and amount[max_debit] == 0):
        return 0

    min = min_of_2(-amount[max_debit], amount[max_credit])
    amount[max_credit] -= min
    amount[max_debit] += min

    payment = {
        'from': max_debit,
        'amount': min,
        'to': max_credit
    }

    payment_list.append(payment)
    optimize_cash_flow(amount, payment_list)