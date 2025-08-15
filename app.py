from flask import Flask, render_template, redirect, url_for, make_response
import requests
from bs4 import BeautifulSoup
import pandas as pd
import matplotlib.pyplot as plt
import os

app = Flask(__name__)

# Configuration
app.config['UPLOAD_FOLDER'] = 'static'

# Global variable to store scraped data
scraped_data = pd.DataFrame()

@app.route('/')
def loading():
    return render_template('loading.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/codroidhub')
def codroidhub():
    return render_template('codroidhub.html')

@app.route('/github')
def github():
    return render_template('github.html')

@app.route('/blogs')
def blogs():
    return render_template('blogs.html')

@app.route('/scrape')
def scrape_books():
    global scraped_data
    url = 'http://books.toscrape.com/index.html'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    books=[]
    items = soup.find_all('article', class_='product_pod')

    for item in items:
        title_element = item.find("h3").find("a")
        price_element = item.find('p', class_='price_color')
        availability_element = item.find('p', class_='instock availability')

        title = title_element.get('title') if title_element else 'No title'
        price = price_element.get_text(strip=True) if price_element else 'No price'
        availability = availability_element.get_text(strip=True) if availability_element else 'No availability'
        books.append({
            'title': title,
            'price': price,
            'availability': availability
        })

    scraped_data = pd.DataFrame(books, columns=['title', 'price', 'availability'])

    scraped_data['price'] = scraped_data['price'].str.replace(r'[^\d.]', '', regex=True).astype(float)

    return render_template('scrape_index.html', books=scraped_data.to_html(classes='table table-striped', index=False))

@app.route('/bar')
def bar_chart():
    if scraped_data.empty:
        return redirect('/scrape')
    
    # Create minimal, aesthetic bar chart
    try:
        plt.style.use('seaborn-v0_8-whitegrid')
    except:
        plt.style.use('default')
    fig, ax = plt.subplots(figsize=(16, 10))
    fig.patch.set_facecolor('#000000')
    ax.set_facecolor('#000000')
    
    # Use single accent color for minimalism
    bars = ax.bar(scraped_data['title'], scraped_data['price'], 
                  color='#40e0d0', alpha=0.7, width=0.6)
    
    # Minimal styling
    ax.set_xlabel('Books', fontsize=14, color='#ffffff', fontweight='300')
    ax.set_ylabel('Price (£)', fontsize=14, color='#ffffff', fontweight='300')
    ax.set_title('Book Prices', fontsize=18, color='#40e0d0', fontweight='400', pad=25)
    
    # Clean minimal appearance
    ax.tick_params(colors='#888888', labelsize=10)
    ax.grid(True, alpha=0.1, color='#40e0d0', linewidth=0.5)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('#333333')
    ax.spines['left'].set_color('#333333')
    
    # Rotate labels for better readability
    plt.xticks(rotation=45, ha='right')
    
    chart_path = os.path.join(app.config['UPLOAD_FOLDER'], 'bar_chart.png')
    plt.tight_layout()
    plt.savefig(chart_path, facecolor='#000000', dpi=300, bbox_inches='tight')
    plt.close()

    return render_template('bar_chart.html', chart_url=url_for('static', filename='bar_chart.png'))

@app.route('/pie')
def pie_chart():
    if scraped_data.empty:
        return redirect('/scrape')
    
    # Create availability categories for pie chart
    availability_counts = scraped_data['availability'].value_counts()
    
    # Minimal, aesthetic pie chart
    fig, ax = plt.subplots(figsize=(10, 10))
    fig.patch.set_facecolor('#000000')
    
    # Minimal color palette - subtle aurora tones
    minimal_colors = ['#40e0d0', '#5ae6d8', '#74ece0', '#8ef2e8']
    colors_to_use = minimal_colors[:len(availability_counts)]
    
    # Clean pie chart with minimal design
    wedges, texts, autotexts = ax.pie(availability_counts.values, 
                                     labels=None,  # Remove labels for cleaner look
                                     autopct='%1.1f%%',
                                     colors=colors_to_use,
                                     startangle=90,
                                     counterclock=False,
                                     wedgeprops=dict(width=0.8, edgecolor='#000000', linewidth=2))
    
    # Style percentage text minimally
    for autotext in autotexts:
        autotext.set_color('#ffffff')
        autotext.set_fontweight('400')
        autotext.set_fontsize(12)
    
    # Add clean title
    ax.set_title('Availability Distribution', fontsize=16, color='#40e0d0', 
                fontweight='400', pad=30)
    
    # Create clean legend
    ax.legend(wedges, availability_counts.index, 
             loc="center left", bbox_to_anchor=(1, 0, 0.5, 1),
             fontsize=11, frameon=False, 
             labelcolor='#ffffff', fancybox=False)
    
    pie_chart_path = os.path.join(app.config['UPLOAD_FOLDER'], 'pie_chart.png')
    plt.tight_layout()
    plt.savefig(pie_chart_path, facecolor='#000000', dpi=300, bbox_inches='tight')
    plt.close()

    return render_template('pie_chart.html', chart_url=url_for('static', filename='pie_chart.png'))

@app.route('/export_csv')
def export_csv():
    if scraped_data.empty:
        return redirect('/scrape')
    
    # Create CSV response
    csv_data = scraped_data.to_csv(index=False)
    response = make_response(csv_data)
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=books_data.csv'
    
    return response

@app.route('/export_gilson_csv')
def export_gilson_csv():
    gilson_df = pd.read_csv('ws_csv_files/GilsonPipettes.csv')
    
    # Create CSV response
    csv_data = gilson_df.to_csv(index=False)
    response = make_response(csv_data)
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=gilson_pipettes.csv'
    
    return response

@app.route('/gilson')
def gilson():
    gilson_df = pd.read_csv('ws_csv_files/GilsonPipettes.csv')
    
    return render_template('gilson.html', tables=[gilson_df.to_html(classes='table table-striped', index=False)])

@app.route('/gaming_mouse')
def gaming_mouse():
    mouse_df = pd.read_csv('ws_csv_files/GamingMouseList.csv')

    return render_template('gaming_mouse.html', tables=[mouse_df.to_html(classes='table table-striped', index=False)])

@app.route('/gaming_laptop')
def gaming_laptop():
    laptop_df = pd.read_csv('ws_csv_files/GamingLaptopsList.csv')

    return render_template('gaming_laptop.html', tables=[laptop_df.to_html(classes='table table-striped', index=False)])

@app.route('/export_mouse_csv')
def export_mouse_csv():
    mouse_df = pd.read_csv('ws_csv_files/GamingMouseList.csv')
    
    csv_data = mouse_df.to_csv(index=False)
    response = make_response(csv_data)
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=gaming_mouse_list.csv'
    
    return response

@app.route('/export_laptop_csv')
def export_laptop_csv():
    laptop_df = pd.read_csv('ws_csv_files/GamingLaptopsList.csv')
    
    csv_data = laptop_df.to_csv(index=False)
    response = make_response(csv_data)
    response.headers['Content-Type'] = 'text/csv'
    response.headers['Content-Disposition'] = 'attachment; filename=gaming_laptop_list.csv'
    
    return response

@app.route('/projects')
def projects():
    return redirect(url_for('services'))

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/web_scraping')
def web_scraping():
    return render_template('web_scraping.html')

@app.route('/macromolecular')
def macromolecular():
    return render_template('macromolecular.html')

@app.route('/macromolecular_dashboard')
def macromolecular_dashboard():
    return render_template('macromolecular_dashboard.html')

if __name__ == '__main__':
    app.run(debug=False, port=5000, host='0.0.0.0')