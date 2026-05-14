async function getSchema() {
  try {
    const res = await fetch('https://rpinrodtgshnorolatry.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaW5yb2R0Z3Nobm9yb2xhdHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTk3MDIsImV4cCI6MjA5NDA3NTcwMn0.p7w4cwwN60wxNBt-6wwUvJCFZPs5m5UsL00ozJDAbAY')
    const text = await res.text()
    console.log(text.slice(0, 500)) // see what it looks like
    
    const data = JSON.parse(text)
    if (data.definitions && data.definitions.products) {
      console.log('found products in definitions!')
      console.log(JSON.stringify(data.definitions.products, null, 2))
    } else {
      console.log('Keys:', Object.keys(data))
      if (data.components && data.components.schemas && data.components.schemas.products) {
        console.log(JSON.stringify(data.components.schemas.products, null, 2))
      }
    }
  } catch(e) {
    console.error(e)
  }
}

getSchema()
