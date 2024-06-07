from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time
from selenium.webdriver.support.ui import Select

temp_id="10"
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument = ("--chromedriver_path=C:\chromedriver-win64\chromedriver-win64\chromedriver.exe")
driver = webdriver.Chrome(options=chrome_options)

driver.get('http://localhost:1000/principal')

time.sleep(5)

paso0 = driver.find_element(By.XPATH, '//*[@id="dropdownUserAvatarButton"]/img')
paso0.click()

time.sleep(5)

paso1 = driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[1]')
paso1.click()

time.sleep(5)


paso2 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'correo_electronico'))
)

paso2.send_keys("IvanSebastian@gmail.com")

time.sleep(5)

paso3 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, 'passwordInicio'))
)

paso3.send_keys("0308")

time.sleep(5)

paso4 = driver.find_element(By.XPATH, '/html/body/div/div/form/button')
paso4.click()

time.sleep(5)

paso5 = driver.find_element(By.XPATH, '//*[@id="dropdownUserAvatarButton"]/img')
paso5.click()

time.sleep(5)

paso6 = driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[1]')
paso6.click()

time.sleep(5)

paso7 = driver.find_element(By.XPATH, '/html/body/div/div/div[1]/div/table/tbody/tr[1]/td[9]/a')
paso7.click()

time.sleep(5)

paso8 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'asunto'))
)

paso8.send_keys("Residentes Alarmados por Falta de Seguridad y Mantenimiento en Áreas Comunes")

time.sleep(5)

paso9 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'descripcion'))
)

paso9.send_keys("La falta de seguridad y puede haber creado una oportunidad para robos o actos vandálicos. Los residentes, preocupados por su seguridad, podrían haber expresado sus quejas a la administración del condominio.")

time.sleep(5)

paso10 = driver.find_element(By.ID, 'tipo')
select = Select(paso10)
select.select_by_value("2")

time.sleep(5)

paso11 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'fecha'))
)

paso11.send_keys("22/06/2024")

time.sleep(5)

paso12 = driver.find_element(By.XPATH, '//*[@id="imagen"]')

# Cargar la imagen
imagen = r"C:\Users\ervin\Downloads\Selenium_SIAC_3.0.1\Condomino\imagenes\descarga.png"

paso12.send_keys(imagen)

time.sleep(5)

paso13 = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[3]/form/div/button')
paso13.click()

time.sleep(5)

paso14 = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[1]/div/table/tbody/tr[2]/td[6]/a')
paso14.click()

time.sleep(5)

paso15 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'comentario'))
)

paso15.send_keys("Se contratara mas personal de seguridad")

time.sleep(5)

paso16 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'empleado'))
)

paso16.send_keys("Ivan")

time.sleep(5)

paso17 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'fecha'))
)

paso17.send_keys("29/06/2024")

time.sleep(5)

paso18 = driver.find_element(By.ID,'status')
select = Select(paso18)
select.select_by_index("1")

time.sleep(8)

paso19 = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[2]/div[3]/form/div/button')
paso19.click()

time.sleep(5)
paso20 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'comentario'))
)

paso20.send_keys("Se contrato mas personal de seguridad con rondas extras en la noche")

time.sleep(5)

paso21 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'empleado'))
)

paso21.send_keys("Ivan")

time.sleep(5)

paso22 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'fecha'))
)

paso22.send_keys("08/07/2024")

time.sleep(5)

paso23 = driver.find_element(By.ID,'status')
select = Select(paso23)
select.select_by_index("2")

time.sleep(5)

paso24 = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[2]/div[3]/form/div/button')
paso24.click()

time.sleep(15)

driver.quit()