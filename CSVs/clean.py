import pandas as pd

df = pd.read_csv('minor_requirements.csv')
df['Minor'] = df['Minor'].apply(lambda x: x if x.endswith(' (m)') else x + ' (m)')
df.to_csv('CSVs/minor_requirements.csv', index=False)
df = pd.read_csv('CSVs/minor_requirements.csv')
print(df.head())
