import App from './App.svelte'

const main = () => {
  return new App({
    target: document.body,
    props: {
      name: 'world'
    }
  })
}

main()
