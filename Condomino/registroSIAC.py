from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import random
import string
from faker import Faker
import time

# Crear una instancia de Faker
fake = Faker()

# Función para generar un nombre de usuario aleatorio
def generar_nombre_usuario():
    return ''.join(random.choices(string.ascii_letters, k=8))

# Función para generar un correo electrónico aleatorio
def generar_correo_electronico():
    nombre = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    return f"{nombre}@gmail.com"

# Función para generar una contraseña aleatoria
def generar_contrasena():
    caracteres = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choices(caracteres, k=12))

# Función para generar un número de teléfono aleatorio de 10 dígitos
def generar_telefono():
    return ''.join(random.choices(string.digits, k=10))

# Generar datos aleatorios
nombre_usuario = generar_nombre_usuario()
correo_electronico = generar_correo_electronico()
contrasena = generar_contrasena()
telefono = generar_telefono()

# Configurar el webdriver
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--chromedriver_path=C:\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
driver = webdriver.Chrome(options=chrome_options)

driver.get('http://localhost:1000/principal')

time.sleep(5)

# Presionar el botón de registro
paso0 = driver.find_element(By.XPATH, '//*[@id="dropdownUserAvatarButton"]/img')
paso0.click()

time.sleep(5)

paso1 = driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[2]')
paso1.click()

time.sleep(5)

# Presionar el cuadro usuario y escribir el nombre de usuario aleatorio
paso2 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'nombre'))
)
paso2.send_keys(fake.user_name())

time.sleep(5)

# Presionar el cuadro correo electrónico y escribir el correo electrónico aleatorio
paso3 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'correo_electronico'))
)
# Generar un correo electrónico solo con dominio Gmail
paso3.send_keys(fake.email(domain='gmail.com'))

time.sleep(5)

# Presionar el cuadro teléfono y escribir el número de teléfono aleatorio
paso4 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'telefono'))
)
# Limitar el número de teléfono a 10 caracteres
paso4.send_keys(fake.random_number(digits=10))

time.sleep(5)

# Presionar el cuadro contraseña y escribir la contraseña aleatoria
paso5 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'password'))
)
paso5.clear()
paso5.send_keys("Adg4$%$542gDS45$%.")

time.sleep(5)
# Presionar el cuadro confirmar contraseña y escribir la misma contraseña aleatoria
paso6 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, 'confPassword'))
)
paso6.clear()
paso6.send_keys("Adg4$%$542gDS45$%.")

time.sleep(5)

# Presionar el botón de registro
paso7 = driver.find_element(By.XPATH, '/html/body/div/div/form/button')
paso7.click()

time.sleep(15)

driver.quit()

