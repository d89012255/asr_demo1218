import matplotlib.pyplot as plt
file_path = './total_count.txt'
total = []
with open(file_path, 'r') as file:
    lines = file.readlines()
for line in lines:
    total.append(float(line.strip()))  # 使用strip()方法去除行末的换行符

all = 0
for i in range(len(total)):
    all += float(total[i])
x = []
for i in range(25):
    x.append(i+1)

plt.figure(figsize=(5, 5)) 
plt.plot(x, total, color='red')




plt.xlabel('number of time')
plt.ylabel('delay time(ms)')
plt.title('Response time of speech model')
plt.tight_layout()
plt.show()
print("Average Response time of Speech Recognize：",(all/25)," ms") 