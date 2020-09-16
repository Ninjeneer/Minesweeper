<template>
    <header>
        <h1>MineSweeper {{ name }}</h1>
    </header>
</template>

<script>
export default {
    name: 'Header',
    props: {
        name: String
    }
}
</script>

<style>
header {
    background-color: forestgreen;
}
</style>