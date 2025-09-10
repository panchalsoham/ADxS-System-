import pickle
import json
import os
from datetime import datetime

def pickle_to_html(pickle_file):
    # Read pickle file
    with open(pickle_file, 'rb') as f:
        data = pickle.load(f)
    
    # Convert data to HTML
    html_content = generate_html(data)
    css_content = generate_css()
    
    # Save HTML file
    output_dir = os.path.dirname(pickle_file)
    filename = os.path.splitext(os.path.basename(pickle_file))[0]
    
    with open(f'{output_dir}/{filename}.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    # Save CSS file
    with open(f'{output_dir}/{filename}.css', 'w', encoding='utf-8') as f:
        f.write(css_content)

def generate_html(data):
    # Convert data to JSON for better visualization
    if isinstance(data, (dict, list)):
        data_str = json.dumps(data, indent=2)
    else:
        data_str = str(data)
    
    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pickle Data Viewer</title>
    <link rel="stylesheet" href="data.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Pickle Data Viewer</h1>
            <p class="timestamp">Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </header>
        
        <main>
            <div class="data-container">
                <h2>Data Content</h2>
                <pre class="data-content">{data_str}</pre>
            </div>
            
            <div class="info-container">
                <h2>Data Information</h2>
                <ul>
                    <li>Type: {type(data).__name__}</li>
                    <li>Size: {len(str(data))} characters</li>
                </ul>
            </div>
        </main>
        
        <footer>
            <p>Generated using Pickle Data Viewer</p>
        </footer>
    </div>
</body>
</html>
"""
    return html

def generate_css():
    css = """
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    line-height: 1.6;
    background-color: #f5f7fa;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

/* Header styles */
header {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

h1 {
    color: #2196f3;
    margin-bottom: 0.5rem;
}

.timestamp {
    color: #666;
    font-size: 0.9rem;
}

/* Main content styles */
main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}

.data-container,
.info-container {
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #333;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #eee;
}

/* Data content styles */
.data-content {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 5px;
    overflow-x: auto;
    font-family: 'Consolas', monospace;
    font-size: 0.9rem;
    line-height: 1.4;
    border: 1px solid #eee;
}

/* Info list styles */
.info-container ul {
    list-style: none;
}

.info-container li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.info-container li:last-child {
    border-bottom: none;
}

/* Footer styles */
footer {
    text-align: center;
    margin-top: 2rem;
    padding: 1rem;
    color: #666;
    font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 768px) {
    main {
        grid-template-columns: 1fr;
    }
    
    .container {
        padding: 1rem;
    }
    
    header,
    .data-container,
    .info-container {
        padding: 1rem;
    }
}

/* Syntax highlighting */
.string { color: #008000; }
.number { color: #0000ff; }
.boolean { color: #b22222; }
.null { color: #808080; }
.key { color: #a52a2a; }
"""
    return css

# Example usage
if __name__ == "__main__":
    pickle_file_path = "C:\Users\91814\Downloads\svc.pkl"
    pickle_to_html("C:\Users\91814\Downloads\svc.pkl")