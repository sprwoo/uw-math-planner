# import pandas as pd

# df = pd.read_csv('minor_requirements.csv')
# df['Minor'] = df['Minor'].apply(lambda x: x if x.endswith(' (m)') else x + ' (m)')
# df.to_csv('CSVs/minor_requirements.csv', index=False)
# df = pd.read_csv('CSVs/minor_requirements.csv')
# print(df.head())

import pandas as pd

df = pd.read_csv('CSVs/major_requirements.csv')
df = df.sort_values(by='Major')  # Sort the DataFrame by the 'Minor' column
df.to_csv('CSVs/major_requirements.csv', index=False)  # Save the sorted DataFrame
df = pd.read_csv('CSVs/major_requirements.csv')
print(df.head())