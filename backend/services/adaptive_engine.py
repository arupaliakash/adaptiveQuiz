def update_difficulty(score):

    if score > 80:
        return "Hard"
    elif score > 50:
        return "Medium"
    else:
        return "Easy"