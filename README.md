# JustStreamIt


## Requirements

-   API OCMovies-Api-EN-FR
```bash
#download api on github
git clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git

#ce déplace pour être dans le dossier de l'api
cd OCMovies-API-EN-FR

```


-for windows:
```python
c:\>python -m venv c:\path\to\OCMovies-API-EN-FR
```
-for linux:
```python
python -m venv /path/to/OCMovies-API-EN-FR
```


-for windows:
```python
c:\>path\to\OCMovies-API-EN-FR\Scripts\activate.bat
```
-for linux:
```python
source /path/to/OCMovies-API-EN-FR/bin/activate
```


```python
pip install -r requirements.txt
```
if you are this error (i use manjaro):
```python
error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try "pacman -S
    python-xyz", where xyz is the package you are trying to
    install.

```

try with this command:
```python
pip install -r requirements.txt --break-system-packages
```
Make sure that you have all of the required dependencies installed before running the script. You can install the required dependencies by running the following command:
```python
#créer la bdd et lance le serveur
python manage.py create_db
python manage.py runserver
```
## Usage
in JustStreamIt folder.
Open the index.html in your favorite internet browser.
