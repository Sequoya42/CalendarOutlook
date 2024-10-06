<script lang="ts">
    export let id: number;
    export let type: string;
    export let message: string;

    import { removeNotification } from '$store';
</script>

<div class={`notification ${type}`}>
    <p>{message}</p>
    <button on:click={() => removeNotification(id)}>✖</button>
</div>

<style>
    .notification {
        padding: 1rem;
        margin: 0.5rem 0;
        border-radius: 3px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
    }
    .notification.success { background-color: #4caf50; }
    .notification.error { background-color: #f44336; }
    .notification.info { background-color: #2196f3; }
    button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
    }
</style>