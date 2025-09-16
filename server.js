<!DOCTYPE html>
<html lang="hi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Shubhzone</title>

    <!-- External Fonts and Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- Main App Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Caveat&display=swap"
        rel="stylesheet">

    <style>
        /* ================================================= /
        / === Shubhzone App Styles (Code 2) - FINAL v6.0 === /
        / === MODIFIED AS PER USER REQUEST - AUG 2025    === /
        / === SOLVED: Styles for Reward System & UI/UX   === /
        / ================================================= */

        /* Design Style Guide */
        :root {
            /* Core Color Palette */
            --background: #121212;
            /* Deep Dark Gray/Black */
            --secondary-background: #1A1A1A;
            /* Slightly Lighter Dark Gray for cards, modals */
            --primary-neon: #00FFFF;
            /* Pure Cyan - Your signature Neon color */
            --text-primary: #EEEEEE;
            /* Light Gray for main text */
            --text-secondary: #AAAAAA;
            /* Medium Gray for subheadings, timestamps, helpers */
            --text-disabled: #666666;
            /* Darker Gray for inactive elements */
            --error-red: #FF0000;
            /* Bright Red for danger/errors */
            --success-green: #00FF00;
            /* Bright Green for success */

            /* RGB values for transparent uses in JS or CSS */
            --primary-neon-rgb: 0, 255, 255;
            --background-rgb: 18, 18, 18;
            --secondary-background-rgb: 26, 26, 26;
            --text-primary-rgb: 238, 238, 238;
            --text-secondary-rgb: 170, 170, 170;
            --error-red-rgb: 255, 0, 0;
            --success-green-rgb: 0, 255, 0;

            /* Legacy/Mapped variables (prefer new explicit ones) */
            --dark-grey: var(--secondary-background);
            /* Mapped to secondary background */
            --light-grey: var(--text-secondary);
            /* Mapped to secondary text for general UI use */

        }

        html {
            box-sizing: border-box;
        }

        *,
        *:before,
        *:after {
            box-sizing: inherit;
            /* Apply box-sizing to all elements */
        }

        body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--background);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            width: 100vw;
            min-height: 100vh;
            overflow: hidden;
            overscroll-behavior-y: none;
        }

        .app-container {
            width: 100%;
            height: var(--app-height, 100vh);
            max-width: 420px;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            background-color: var(--background);
            isolation: isolate;
            transition: all 0.3s ease-in-out;
        }

        /* ★★★ FIX: फ़ुलस्क्रीन रोटेशन के लिए कंटेनर स्टाइल (REWORKED) ★★★ */
        .app-container.fullscreen-active {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 100vh;
            /* चौड़ाई को स्क्रीन की ऊंचाई के बराबर करें */
            height: 100vw;
            /* ऊंचाई को स्क्रीन की चौड़ाई के बराबर करें */
            max-width: none;
            z-index: 5000;
            border-radius: 0;
            border: none;
            box-shadow: none;
            transform-origin: center center;
            transform: translate(-50%, -50%) rotate(90deg);
            /* बीच में रखकर 90 डिग्री घुमाएं */
        }

        .app-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-image:
                radial-gradient(circle at 20% 30%, var(--primary-neon), transparent 20%),
                radial-gradient(circle at 80% 10%, var(--primary-neon), transparent 20%),
                radial-gradient(circle at 50% 80%, var(--primary-neon), transparent 20%);
            background-repeat: no-repeat;
            opacity: 0.15;
            filter: blur(20px);
            animation: animateParticles 20s linear infinite alternate;
        }

        @keyframes animateParticles {
            from {
                transform: translate(0, 0);
            }

            to {
                transform: translate(20px, -30px) scale(1.2);
            }
        }

        .screen {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0;
            box-sizing: border-box;
            opacity: 0;
            pointer-events: none;
            overflow: hidden;
            transform-origin: center center;
            background-color: transparent;
            transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }

        .screen.active {
            opacity: 1;
            pointer-events: auto;
            z-index: 10;
            transform: none;
        }

        #splash-screen {
            padding: 20px;
            background-color: var(--background);
            z-index: 11;
        }

        #splash-screen {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 40px 20px 20px 20px;
            background-color: var(--background);
            box-sizing: border-box;
            text-align: center;
            overflow: hidden;
            position: relative;
        }

        .welcome-top,
        .welcome-center,
        .welcome-bottom {
            z-index: 2;
            position: relative;
            width: 100%;
        }

        .welcome-top {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .welcome-text {
            font-family: 'Roboto', sans-serif;
            font-size: 3.5em;
            font-weight: 700;
            color: var(--primary-neon);
            text-shadow: 0 0 10px rgba(var(--primary-neon-rgb), 0.5);
            margin: 0;
        }

        .welcome-center {
            flex-grow: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .logo-container {
            width: 150px;
            height: 150px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
        }

        @keyframes rotate-gradient {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .logo-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: conic-gradient(from 0deg, rgba(var(--primary-neon-rgb), 0.8), transparent, rgba(var(--primary-neon-rgb), 0.8));
            animation: rotate-gradient 4s linear infinite;
        }

        .logo-icon-combo {
            width: 90%;
            height: 90%;
            background: var(--background);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 4em;
            color: var(--primary-neon);
            position: relative;
        }

        .logo-icon-combo .fa-play {
            transform: translateX(4px);
        }

        .app-name {
            font-family: 'Roboto', sans-serif;
            font-size: 2.8em;
            font-weight: 700;
            margin: 0;
            background: linear-gradient(45deg, var(--primary-neon), var(--primary-neon), var(--primary-neon));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 8px rgba(var(--primary-neon-rgb), 0.3);
        }

        #splash-screen .tagline {
            font-family: 'Roboto', sans-serif;
            font-size: 1.2em;
            font-style: italic;
            color: var(--text-secondary);
            margin-top: 5px;
            letter-spacing: 1px;
            padding: 0;
        }

        #splash-screen .tagline::after {
            content: '';
            display: block;
            width: 20px;
            height: 3px;
            background: var(--text-secondary);
            margin: 5px auto 0;
            border-radius: 3px;
        }

        .welcome-bottom {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            padding-bottom: 10px;
        }

        .get-started-btn {
            padding: 12px 35px;
            border: none;
            border-radius: 50px;
            background: var(--primary-neon);
            color: var(--background);
            font-family: 'Roboto', sans-serif;
            font-size: 1.2em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 20px;
            box-shadow: 0 0 15px rgba(var(--primary-neon-rgb), 0.5);
        }

        #loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 10px;
            color: var(--text-primary);
            margin-bottom: 20px;
        }

        .loader {
            border: 4px solid rgba(var(--text-primary-rgb), 0.3);
            border-radius: 50%;
            border-top: 4px solid var(--primary-neon);
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .get-started-btn:hover {
            background: rgba(var(--primary-neon-rgb), 0.8);
            transform: scale(1.05);
            box-shadow: 0 0 25px rgba(var(--primary-neon-rgb), 0.7);
        }

        .creator-credit-new {
            font-family: 'Caveat', cursive;
            font-size: 1.1em;
            color: rgba(var(--text-secondary-rgb), 0.8);
            margin: 0;
        }

        #long-video-load-more-btn {
            background-color: var(--primary-neon);
            color: var(--background);
            font-weight: 700;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: auto;
            display: block;
            margin: 20px auto;
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
        }

        #long-video-load-more-btn:disabled {
            background-color: var(--text-disabled);
            cursor: not-allowed;
        }

        #home-screen,
        #main-home-screen {
            padding: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        #video-swiper {
            flex-grow: 1;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            scroll-snap-type: y mandatory;
            -webkit-overflow-scrolling: touch;
        }

        .video-slide {
            width: 100%;
            height: 100%;
            scroll-snap-align: start;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--background);
        }

        .video-slide .player-container,
        .video-slide .html5-player {
            width: 100%;
            height: 100%;
            max-width: 420px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            object-fit: cover;
        }

        .video-slide iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        .video-preloader {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--background);
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            background-size: cover;
            background-position: center;
        }

        .static-message {
            color: var(--text-secondary);
            font-size: 1.2em;
            text-align: center;
            padding: 20px;
            width: 100%;
        }

        .bottom-nav {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 60px;
            background-color: rgba(var(--background-rgb), 0.7);
            backdrop-filter: blur(10px);
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 100;
            border-top: 1px solid rgba(var(--text-primary-rgb), 0.1);
        }

        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 0.7em;
            transition: color 0.3s ease;
            flex-grow: 1;
            height: 100%;
            padding-top: 5px;
        }

        .nav-item.active {
            color: transparent;
            background: linear-gradient(45deg, var(--primary-neon), var(--primary-neon));
            -webkit-background-clip: text;
            background-clip: text;
        }

        .nav-item.active i {
            color: transparent;
            background: linear-gradient(45deg, var(--primary-neon), var(--primary-neon));
            -webkit-background-clip: text;
            background-clip: text;
        }

        .nav-item i {
            font-size: 1.5em;
            margin-bottom: 5px;
        }

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.4s ease-in-out;
        }

        .modal-overlay.active {
            display: flex;
            opacity: 1;
        }

        ::-webkit-scrollbar {
            width: 5px;
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--text-secondary);
            border-radius: 5px;
        }

        .screen-header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: flex-start; /* Adjusted for menu icon and search */
            padding: 0 15px;
            background-color: rgba(var(--background-rgb), 0.5);
            backdrop-filter: blur(5px);
            z-index: 50;
            border-bottom: 1px solid rgba(var(--text-primary-rgb), 0.1);
            gap: 10px;
        }

        .screen-header.transparent {
            background-color: transparent;
            backdrop-filter: none;
            border-bottom: none;
        }
        
        /* ★★★ NEW: Search Bar Styles ★★★ */
        .header-search-container {
            display: flex;
            flex-grow: 1;
            align-items: center;
            background-color: var(--secondary-background);
            border-radius: 20px;
            border: 1px solid var(--text-secondary);
            overflow: hidden;
            padding: 0 5px 0 12px;
        }
        .header-search-input {
            flex-grow: 1;
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 0.9em;
            height: 36px;
            padding: 0;
        }
        .header-search-input:focus {
            outline: none;
        }
        .header-search-btn {
            background: none;
            border: none;
            color: var(--primary-neon);
            font-size: 1.1em;
            cursor: pointer;
            padding: 8px;
        }


        .screen-header .header-title {
            font-size: 1.5em;
            font-weight: 700;
            color: var(--text-primary);
            position: absolute; /* Center title */
            left: 50%;
            transform: translateX(-50%);
        }


        .header-icon-left,
        .header-icon-right {
            font-size: 1.6em;
            cursor: pointer;
            color: var(--text-primary);
            position: relative; /* Relative positioning within flexbox */
            z-index: 1;
        }

        #creator-page-screen .screen-header {
             justify-content: center;
        }
         #creator-page-screen .header-icon-left {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
        }

        .video-actions-overlay {
            position: absolute;
            bottom: 80px;
            right: 10px;
            z-index: 15;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            transition: bottom 0.4s ease;
        }

        .action-icon-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            color: var(--text-primary);
            text-align: center;
        }

        .action-icon-container .icon {
            font-size: 2.2em;
            text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
            transition: transform 0.2s ease, color 0.2s ease;
        }

        .action-icon-container[data-action="creator"] .icon {
            color: var(--text-primary);
        }

        .action-icon-container[data-action="creator"] .count {
            font-size: 0.8em;
        }

        .action-icon-container[data-action="comment"] .icon {
            color: var(--primary-neon);
        }

        .action-icon-container:hover .icon {
            transform: scale(1.1);
        }

        .action-icon-container .count {
            font-size: 0.9em;
            font-weight: 700;
            margin-top: 4px;
        }

        .home-top-bar {
            width: 100%;
            height: 50px;
            background-color: var(--background);
            display: flex;
            align-items: center;
            padding: 0 10px;
            z-index: 50;
            flex-shrink: 0;
            border-bottom: 1px solid var(--secondary-background);
        }

        .home-menu-icon {
            font-size: 1.6em;
            padding: 0 10px;
            cursor: pointer;
            color: var(--text-primary);
        }

        .category-scroller {
            flex-grow: 1;
            display: flex;
            gap: 10px;
            overflow-x: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .category-scroller::-webkit-scrollbar {
            display: none;
        }

        .category-chip {
            padding: 6px 15px;
            background-color: var(--secondary-background);
            border: 1px solid var(--text-secondary);
            color: var(--text-primary);
            border-radius: 20px;
            font-size: 0.9em;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .category-chip.active {
            background-color: var(--primary-neon);
            color: var(--background);
            border-color: var(--primary-neon);
            font-weight: 700;
        }

        .video-meta-overlay {
            position: absolute;
            bottom: 65px;
            left: 0;
            width: 100%;
            padding: 15px;
            box-sizing: border-box;
            background: linear-gradient(to top, rgba(var(--background-rgb), 0.5), transparent);
            z-index: 10;
            color: var(--text-primary);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-start;
            transition: bottom 0.4s ease;
        }

        .video-meta-overlay .uploader-info {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            cursor: pointer;
        }

        .video-meta-overlay .uploader-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--text-primary);
        }

        .video-meta-overlay .uploader-name {
            font-weight: 500;
            font-size: 1em;
        }

        .video-meta-overlay .video-title {
            font-weight: 400;
            font-size: 0.9em;
            margin: 0;
            margin-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        }

        .add-channel-btn {
            pointer-events: auto;
            background-color: rgba(var(--secondary-background-rgb), 0.7);
            color: var(--primary-neon);
            border: 1px solid var(--primary-neon);
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .add-channel-btn:hover {
            background-color: var(--primary-neon);
            color: var(--background);
        }

        .add-channel-btn i {
            font-size: 0.9em;
        }

        .add-channel-btn-long-grid {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.6);
            color: var(--primary-neon);
            border: 1px solid var(--primary-neon);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 5;
            opacity: 0;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .long-video-card:hover .add-channel-btn-long-grid {
            opacity: 1;
        }

        .add-channel-btn-long-grid:hover {
            background-color: var(--primary-neon);
            color: var(--background);
        }

        .comments-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1100;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
        }

        .comments-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .comments-modal-content {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60%;
            max-height: 70vh;
            background-color: var(--secondary-background);
            border-radius: 15px 15px 0 0;
            box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            transform: translateY(100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .comments-modal-overlay.active .comments-modal-content {
            transform: translateY(0);
        }

        .comments-header {
            padding: 15px;
            text-align: center;
            border-bottom: 1px solid var(--text-secondary);
            position: relative;
        }

        .comments-header h4 {
            margin: 0;
            font-size: 1.1em;
            color: var(--text-primary);
        }

        .comments-header .close-comments-btn {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.5em;
            cursor: pointer;
            color: var(--text-primary);
        }

        #comments-list {
            flex-grow: 1;
            overflow-y: auto;
            padding: 15px;
            list-style: none;
            margin: 0;
            color: var(--text-primary);
        }

        .comment-input-container {
            display: flex;
            padding: 10px 15px;
            border-top: 1px solid var(--text-secondary);
            gap: 10px;
        }

        #comment-input {
            flex-grow: 1;
            background-color: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--text-secondary);
            border-radius: 20px;
            padding: 10px 15px;
            color: var(--text-primary);
            font-size: 1em;
        }

        #send-comment-btn {
            background: none;
            border: none;
            color: var(--primary-neon);
            font-size: 1.8em;
            cursor: pointer;
        }

        .main-sidebar {
            position: absolute;
            top: 0;
            left: 0;
            width: 280px;
            height: 100%;
            background-color: var(--secondary-background);
            z-index: 1001;
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-shadow: 4px 0 15px rgba(0, 0, 0, 0.5);
            color: var(--text-primary);
        }

        .main-sidebar.open {
            transform: translateX(0);
        }

        .sidebar-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease-in-out;
        }

        .sidebar-overlay.open {
            opacity: 1;
            visibility: visible;
        }

        .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--text-secondary);
        }

        .sidebar-header h3 {
            margin: 0;
            color: var(--primary-neon);
        }

        .close-sidebar-btn {
            font-size: 2em;
            cursor: pointer;
            line-height: 1;
            color: var(--text-primary);
        }

        .sidebar-option {
            background: var(--secondary-background);
            border: 1px solid var(--text-secondary);
            color: var(--text-primary);
            padding: 15px;
            width: 100%;
            text-align: left;
            cursor: pointer;
            border-radius: 8px;
            font-size: 1.1em;
            transition: background-color 0.2s ease, border-color 0.2s ease;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .sidebar-option:hover {
            background-color: rgba(var(--text-primary-rgb), 0.1);
            border-color: var(--primary-neon);
        }

        .premium-features-card {
            display: block;
            margin-top: 10px;
            width: 100%;
            text-decoration: none;
            color: var(--text-primary);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border-radius: 12px;
        }

        .premium-features-card:hover {
            transform: scale(1.03);
            box-shadow: 0 0 20px rgba(var(--primary-neon-rgb), 0.7);
        }

        .premium-features-card .premium-image-wrapper {
            aspect-ratio: 1 / 1;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 10px;
            border: 2px solid var(--primary-neon);
            background-color: var(--secondary-background);
        }

        .premium-features-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .premium-features-card span {
            font-size: 1.1em;
            font-weight: 600;
            display: block;
        }

        #long-video-screen,
        #history-screen {
            padding: 0;
            overflow-y: hidden;
            height: 100%;
        }

        .long-video-screen-content,
        .history-content {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            display: flex;
            flex-direction: column;
            padding-bottom: 60px;
        }

        #long-video-top-bar,
        #history-top-bar {
            width: 100%;
            height: 50px;
            background-color: var(--background);
            display: flex;
            align-items: center;
            padding: 0 10px;
            flex-shrink: 0;
            border-bottom: 1px solid var(--secondary-background);
        }

        #long-video-menu-icon,
        #history-menu-icon {
            font-size: 1.6em;
            padding: 0 10px;
            cursor: pointer;
            color: var(--text-primary);
        }

        #long-video-category-scroller {
            flex-grow: 1;
            display: flex;
            gap: 10px;
            overflow-x: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
            padding: 0 5px;
        }

        #long-video-category-scroller::-webkit-scrollbar,
        #history-shorts-scroller::-webkit-scrollbar {
            display: none;
        }

        #long-video-carousel-container {
            width: 100%;
            overflow-x: auto;
            padding: 15px 0;
            position: relative;
            flex-shrink: 0;
            -ms-overflow-style: none;
            scrollbar-width: none;
            background-color: var(--secondary-background);
        }

        #long-video-carousel-container::-webkit-scrollbar {
            display: none;
        }

        #long-video-carousel-wrapper {
            display: flex;
            width: fit-content;
        }

        .carousel-card {
            flex-shrink: 0;
            width: 284px;
            height: 160px;
            margin: 0 8px;
            border-radius: 12px;
            background-size: cover;
            background-position: center;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid var(--text-secondary);
            color: var(--text-primary);
        }

        .carousel-card:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px var(--primary-neon);
        }

        .long-video-search-container {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px 20px;
            border-bottom: 1px solid var(--secondary-background);
            flex-shrink: 0;
        }

        #long-video-search-input {
            flex-grow: 1;
            padding: 10px 15px;
            border-radius: 20px;
            border: 1px solid var(--text-secondary);
            background-color: var(--secondary-background);
            color: var(--text-primary);
            font-size: 1em;
        }

        #long-video-search-btn,
        #long-video-history-btn {
            background-color: var(--secondary-background);
            border: none;
            color: var(--text-primary);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.1em;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s ease;
        }

        #long-video-search-btn:hover,
        #long-video-history-btn:hover {
            background-color: var(--primary-neon);
        }

        #long-video-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
            width: 100%;
        }

        .long-video-card {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            background-color: var(--secondary-background);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            cursor: pointer;
        }

        /* ★★★ FIX: वीडियो कार्ड को 16:9 का अनुपात दिया गया ★★★ */
        .long-video-thumbnail {
            width: 100%;
            aspect-ratio: 16 / 9;
            background-size: cover;
            background-position: center;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }

        .long-video-card:hover .long-video-thumbnail {
            transform: scale(1.05);
        }

        .play-icon-overlay {
            font-size: 3em;
            color: rgba(var(--text-primary-rgb), 0.8);
            background-color: rgba(0, 0, 0, 0.4);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.3s ease;
        }

        .long-video-card:hover .play-icon-overlay {
            opacity: 1;
            transform: scale(1);
        }

        .long-video-info-container {
            padding: 12px 15px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .long-video-details {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 3px;
            overflow: hidden;
        }

        .long-video-name {
            font-size: 1.1em;
            font-weight: 600;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .long-video-uploader {
            font-size: 0.9em;
            color: var(--text-secondary);
        }

        #history-top-bar {
            justify-content: space-between;
        }

        #history-date-button {
            background: none;
            border: 1px solid var(--text-secondary);
            color: var(--text-primary);
            padding: 6px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9em;
            transition: all 0.2s ease;
        }

        #history-date-button:hover {
            background-color: var(--secondary-background);
        }

        .history-section-title {
            padding: 15px 20px 5px 20px;
            font-size: 1.2em;
            font-weight: 600;
            color: var(--text-primary);
        }

        #history-shorts-scroller {
            display: flex;
            overflow-x: auto;
            padding: 10px 20px;
            gap: 10px;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .history-short-card {
            width: 100px;
            aspect-ratio: 9 / 16;
            border-radius: 8px;
            background-size: cover;
            background-position: center;
            flex-shrink: 0;
            cursor: pointer;
            transition: transform 0.2s ease;
            position: relative;
            overflow: hidden;
        }

        .history-short-card:hover {
            transform: scale(1.05);
        }

        .history-short-card .history-item-menu {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8em;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .history-short-card:hover .history-item-menu {
            opacity: 1;
        }

        .history-short-card .history-item-menu:hover {
            background-color: var(--error-red);
        }

        #history-long-video-list {
            padding: 15px 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .history-list-item {
            display: flex;
            align-items: center;
            background-color: var(--secondary-background);
            border-radius: 8px;
            padding: 8px;
            gap: 12px;
            cursor: pointer;
        }

        .history-item-thumbnail {
            width: 120px;
            height: 67.5px;
            border-radius: 6px;
            background-size: cover;
            background-position: center;
            flex-shrink: 0;
        }

        .history-item-info {
            flex-grow: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .history-item-title {
            font-weight: 500;
            font-size: 0.95em;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: var(--text-primary);
        }

        .history-item-uploader {
            font-size: 0.8em;
            color: var(--text-secondary);
        }

        .history-item-menu {
            padding: 10px;
            cursor: pointer;
            color: var(--text-secondary);
            font-size: 1.1em;
            align-self: center;
            transition: color 0.2s ease;
        }

        .history-item-menu:hover {
            color: var(--error-red);
        }

        .loader-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 0;
        }

        #creator-page-screen .content-area {
            overflow: hidden;
            height: calc(100% - 60px);
            padding: 60px 0 0 0;
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        #creator-page-screen .content-area.player-active {
            height: 100%;
            padding-top: 0;
        }

        #creator-page-tabs {
            display: flex;
            justify-content: center;
            gap: 5px;
            background-color: rgba(var(--secondary-background-rgb), 0.5);
            padding: 5px;
            border-radius: 20px;
            border: 1px solid var(--text-secondary);
            margin: 0 auto;
        }

        .creator-page-tab-btn {
            padding: 6px 15px;
            border: none;
            background-color: transparent;
            color: var(--text-secondary);
            border-radius: 15px;
            font-size: 0.9em;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .creator-page-tab-btn.active {
            background-color: var(--primary-neon);
            color: var(--background);
            font-weight: 700;
        }

        .creator-video-grid,
        .creator-playlist-list {
            height: 100%;
            overflow-y: auto;
            padding: 15px;
            box-sizing: border-box;
        }

        .creator-video-grid {
            display: grid;
            gap: 15px;
        }

        .creator-video-grid.long-video-list {
            grid-template-columns: 1fr;
        }

        .creator-video-grid.long-video-list .long-video-card {
            margin-bottom: 0;
        }

        .creator-video-grid.short-video-list {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }

        .creator-video-grid.short-video-list .history-short-card {
            width: 100%;
        }

        /* ★★★ NEW & MODIFIED: नए वीडियो प्लेयर पेज के लिए स्टाइल ★★★ */
        #creator-page-player-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #000;
            position: relative;
            flex-grow: 1;
        }

        .player-controls-header {
            position: absolute;
            top: 15px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;
            z-index: 30;
            pointer-events: none;
            /* ताकि बटन के अलावा कहीं और क्लिक करने पर वीडियो पर क्लिक हो */
        }

        .player-controls-header>* {
            pointer-events: auto;
            /* बटनों को क्लिक करने योग्य बनाएं */
        }

        /* MODIFIED: पुरानी स्टाइल हटाई गई, क्योंकि अब यह फ्लेक्स आइटम है */
        .player-back-button {
            color: var(--text-primary);
            background-color: rgba(0, 0, 0, 0.5);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2em;
            cursor: pointer;
        }

        /* NEW: ज़ूम कंट्रोल कंटेनर के लिए स्टाइल */
        .player-zoom-controls {
            display: flex;
            gap: 10px;
        }

        /* NEW: प्लेयर हेडर में सभी बटनों के लिए सामान्य स्टाइल */
        .player-controls-header button {
            color: var(--text-primary);
            background-color: rgba(0, 0, 0, 0.5);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            font-size: 1.2em;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }

        .player-controls-header button:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        /* MODIFIED: पुरानी स्टाइल हटाई गई */
        #player-rotate-btn {
            /* अब सामान्य बटन स्टाइल का उपयोग करेगा */
        }

        #player-rotate-btn i {
            transition: transform 0.3s ease;
        }

        .fullscreen-active #player-rotate-btn i {
            transform: rotate(90deg);
        }

        /* MODIFIED: ज़ूम इफ़ेक्ट के लिए ट्रांजीशन जोड़ा गया */
        .player-wrapper {
            width: 100%;
            aspect-ratio: 16 / 9;
            background-color: #000;
            transition: transform 0.3s ease;
            /* स्मूथ ज़ूम के लिए */
        }

        #creator-page-player-long {
            width: 100%;
            height: 100%;
        }

        .fullscreen-active #creator-page-player-container .player-wrapper {
            width: 100%;
            height: 100%;
            aspect-ratio: auto;
        }

        .continue-btn {
            background-color: var(--primary-neon);
            color: var(--background);
        }

        .continue-btn:disabled {
            background-color: var(--text-disabled);
            cursor: not-allowed;
        }

        #image-enlarge-modal .enlarged-image-content {
            background-color: transparent;
            padding: 0;
            width: 90vw;
            height: 80vh;
            max-width: 500px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: none;
        }

        #image-enlarge-modal img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(var(--primary-neon-rgb), 0.5);
        }

        @media (min-width: 768px) {
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                /* ★ बदलाव: बैकग्राउंड पैटर्न को हटा दिया गया है */
                background-color: var(--background);
            }

            .app-container {
                height: min(var(--app-height, 90vh), 850px);
                border-radius: 24px;
                border: 8px solid #000;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                margin: auto;
            }

            .app-container.fullscreen-active {
                height: 100vh;
            }
        }

        /* ★★★★★★★★★★ आपके अनुरोध के अनुसार नए स्टाइल यहाँ जोड़े गए हैं ★★★★★★★★★★ */
        .home-grid-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            /* दो बराबर कॉलम */
            gap: 15px;
            /* कार्ड के बीच में जगह */
            padding: 20px;
            width: 100%;
        }

        .home-grid-card {
            background-color: var(--secondary-background);
            border-radius: 12px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid rgba(var(--primary-neon-rgb), 0.1);
        }

        .home-grid-card img {
            width: 100%;
            aspect-ratio: 1 / 1;
            /* 1:1 का अनुपात */
            object-fit: cover;
            border-radius: 8px;
        }

        .btn-3d {
            width: 100%;
            margin-top: 12px;
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            background-color: var(--primary-neon);
            color: var(--background);
            font-weight: 700;
            font-size: 1em;
            cursor: pointer;
            transition: all 0.1s ease-in-out;
            /* 3D प्रभाव के लिए */
            border-bottom: 4px solid #00AFAF;
            /* थोड़ा गहरा शेड */
        }

        .btn-3d:active {
            /* बटन दबाने पर */
            transform: translateY(2px);
            border-bottom-width: 2px;
        }


        /* ★★★ NEW MOVIE & WEB SERIES EXPERIENCE STYLES - START ★★★ */
        .media-screen-content { /* Generic class for movies and web series */
            width: 100%;
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            display: flex;
            flex-direction: column;
            padding-bottom: 60px; /* bottom-nav के लिए जगह */
        }
        
        /* ★★★ NEW: Styles for Netflix-like rows ★★★ */
        .media-category-row {
            margin-bottom: 25px;
        }
        .media-category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;
            margin-bottom: 12px;
        }
        .media-category-title {
            font-size: 1.4em;
            font-weight: 700;
            margin: 0;
        }
        .media-category-more-btn {
            background: none;
            border: 1px solid var(--text-secondary);
            color: var(--text-secondary);
            font-size: 0.8em;
            border-radius: 15px;
            padding: 4px 10px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .media-category-more-btn:hover {
            border-color: var(--primary-neon);
            color: var(--primary-neon);
        }
        .media-row-scroller {
            display: flex;
            gap: 12px;
            overflow-x: auto;
            padding: 0 15px;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .media-row-scroller::-webkit-scrollbar {
            display: none;
        }
        
        .media-vertical-card { /* Generic class for movie and series cards */
            flex-shrink: 0;
            width: 120px; /* पोस्टर की चौड़ाई */
            aspect-ratio: 2 / 3; /* Standard poster ratio */
            background-color: var(--secondary-background);
            border-radius: 8px;
            background-size: cover;
            background-position: center;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            position: relative;
            border: 1px solid var(--secondary-background);
        }

        .media-vertical-card:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px var(--primary-neon);
            border-color: var(--primary-neon);
        }

        .media-disclaimer {
            background-color: var(--secondary-background);
            color: var(--text-secondary);
            font-size: 0.8em;
            text-align: center;
            padding: 15px;
            margin: 10px 15px;
            border-radius: 8px;
            border: 1px dashed var(--text-disabled);
        }

        /* ★★★ मूवी/सीरीज़ प्लेयर के लिए नया स्क्रीन स्टाइल ★★★ */
        #media-player-screen {
            background-color: #000;
            padding: 0;
        }

        #media-player-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #000;
            position: relative;
        }

        #media-player-container .player-wrapper {
            width: 100%;
            aspect-ratio: 16 / 9;
        }

        #media-player-iframe-container {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        /* ★★★ NEW: Web Series Episode Selector Modal Styles ★★★ */
        #series-details-modal {
            z-index: 1100; /* Must be above other overlays */
        }
        .series-details-content {
            background-color: var(--secondary-background);
            width: 95%;
            max-width: 400px;
            height: 70vh;
            max-height: 500px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .series-details-header {
            padding: 15px;
            position: relative;
            text-align: center;
            border-bottom: 1px solid var(--text-disabled);
            flex-shrink: 0;
        }
        .series-details-header h3 {
            margin: 0;
            font-size: 1.2em;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 25px;
        }
        .series-details-close-btn {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.8em;
            cursor: pointer;
            color: var(--text-primary);
        }
        .series-seasons-tabs {
            display: flex;
            overflow-x: auto;
            padding: 10px 15px;
            gap: 10px;
            border-bottom: 1px solid var(--text-disabled);
            flex-shrink: 0;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .series-seasons-tabs::-webkit-scrollbar { display: none; }
        .season-tab-btn {
            padding: 6px 15px;
            border: 1px solid var(--text-secondary);
            background-color: transparent;
            color: var(--text-secondary);
            border-radius: 15px;
            font-size: 0.9em;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        .season-tab-btn.active {
            background-color: var(--primary-neon);
            color: var(--background);
            border-color: var(--primary-neon);
            font-weight: 700;
        }
        #series-episodes-list {
            flex-grow: 1;
            overflow-y: auto;
            padding: 15px;
            list-style: none;
            margin: 0;
        }
        .episode-item {
            padding: 12px 10px;
            border-bottom: 1px solid rgba(var(--text-secondary-rgb), 0.1);
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .episode-item:hover {
            background-color: rgba(var(--primary-neon-rgb), 0.1);
        }
        .episode-item span {
            font-weight: 500;
        }
        
        /* ★★★ NEW MOVIE & WEB SERIES EXPERIENCE STYLES - END ★★★ */

    </style>
</head>

<body>

    <!-- === SIDEBAR START === -->
    <div id="main-sidebar" class="main-sidebar">
        <div class="sidebar-header">
            <h3>Menu</h3>
            <span id="close-sidebar-btn" class="close-sidebar-btn haptic-trigger">×</span>
        </div>
        <a href="https://shubhzone.onrender.com" target="_blank" rel="noopener noreferrer"
            class="premium-features-card haptic-trigger">
            <div class="premium-image-wrapper">
                <img src="https://i.ibb.co/0RF4GmTZ/Flux-Dev-A-futuristic-social-media-interface-named-Shubhzone-g-1.jpg"
                    alt="Premium Features Image">
            </div>
            <span>Premium Features</span>
        </a>
    </div>
    <div id="sidebar-overlay" class="sidebar-overlay"></div>
    <!-- === SIDEBAR END === -->

    <!-- === ALL MODALS START === -->
    <div id="comments-modal" class="comments-modal-overlay">
        <div class="comments-modal-content">
            <div class="comments-header">
                <h4>Comments</h4>
                <span class="close-comments-btn haptic-trigger" onclick="closeCommentsModal()">×</span>
            </div>
            <ul id="comments-list"></ul>
            <div class="comment-input-container">
                <input type="text" id="comment-input" placeholder="Commenting is disabled." disabled>
                <button id="send-comment-btn" class="haptic-trigger" disabled><i
                        class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    </div>

    <div id="image-enlarge-modal" class="modal-overlay">
        <div class="enlarged-image-content">
            <img id="enlarged-image-src" src="" alt="Enlarged View">
        </div>
    </div>
    
    <!-- ★★★ NEW: Web Series Details Modal ★★★ -->
    <div id="series-details-modal" class="modal-overlay">
        <div class="series-details-content">
            <div class="series-details-header">
                <h3 id="series-details-title">Series Title</h3>
                <span id="series-details-close-btn" class="series-details-close-btn haptic-trigger">×</span>
            </div>
            <div id="series-seasons-tabs" class="series-seasons-tabs">
                <!-- Season tabs will be injected here -->
            </div>
            <ul id="series-episodes-list">
                <!-- Episode list will be injected here -->
                 <div class="loader-container"><div class="loader"></div></div>
            </ul>
        </div>
    </div>
    <!-- === ALL MODALS END === -->

    <div class="app-container" id="app-container">

        <!-- === SPLASH SCREEN === -->
        <div id="splash-screen" class="screen active">
            <div class="welcome-top">
                <h1 class="welcome-text">Welcome ☁️</h1>
            </div>
            <div class="welcome-center">
                <div class="logo-container">
                    <div class="logo-ring"></div>
                    <div class="logo-icon-combo">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <h2 class="app-name">Shubhzone</h2>
                <p class="tagline">Har Hunar ka Ghar</p>
            </div>
            <div class="welcome-bottom">
                <button id="get-started-btn" class="get-started-btn haptic-trigger">Get Started</button>
                <div id="loading-container" style="display: none;">
                    <div class="loader"></div>
                    <p style="margin-top: 10px;">Loading Videos, Please Wait...</p>
                </div>
                <p class="creator-credit-new">Made with ❤️ by Udbhav</p>
            </div>
        </div>

        <!-- ★★★ नया बदलाव: नया खाली होम स्क्रीन (अपलोड फॉर्म हटा दिया गया) ★★★ -->
        <div id="main-home-screen" class="screen">
            <div style="flex-grow: 1; width: 100%; overflow-y: auto;">
                <div class="home-grid-container">
                    <!-- कार्ड 1 -->
                    <div class="home-grid-card">
                        <img src="https://i.ibb.co/fz4R70tD/Leonardo-Phoenix-10-An-animated-scene-of-a-happy-young-boy-rec-3.jpg"
                            alt="Reward Section">
                        <button class="btn-3d haptic-trigger">Reward</button>
                    </div>
                    <!-- कार्ड 2 -->
                    <div class="home-grid-card">
                        <img src="https://i.ibb.co/JWkN2C8z/Leonardo-Phoenix-10-A-beautiful-young-girl-stylish-and-modern-0.jpg"
                            alt="Profile Section">
                        <button class="btn-3d haptic-trigger">Profile</button>
                    </div>
                </div>
            </div>
            <div class="bottom-nav">
                <div class="nav-item active" data-nav="home"><i class="fas fa-home"></i>Home</div>
                <div class="nav-item" data-nav="movies"><i class="fas fa-film"></i>Movies</div>
                <div class="nav-item" data-nav="web-series"><i class="fas fa-tv"></i>Web Series</div>
                <div class="nav-item" data-nav="long-video"><i class="fas fa-video"></i>Long Video</div>
                <div class="nav-item" data-nav="shorts"><i class="fas fa-compact-disc"></i>Shorts</div>
            </div>
        </div>

        <!-- === SHORTS SCREEN (ID 'home-screen' ही है) === -->
        <div id="home-screen" class="screen">
            <div class="home-top-bar">
                <div id="shorts-menu-icon" class="home-menu-icon haptic-trigger">
                    <i class="fas fa-bars"></i>
                </div>
                <div id="category-scroller" class="category-scroller"></div>
            </div>
            <div id="video-swiper">
                <div id="home-static-message-container" style="display: flex;">
                    <p class="static-message">Loading shorts...</p>
                </div>
            </div>
            <div class="bottom-nav">
                <div class="nav-item" data-nav="home"><i class="fas fa-home"></i>Home</div>
                <div class="nav-item" data-nav="movies"><i class="fas fa-film"></i>Movies</div>
                <div class="nav-item" data-nav="web-series"><i class="fas fa-tv"></i>Web Series</div>
                <div class="nav-item" data-nav="long-video"><i class="fas fa-video"></i>Long Video</div>
                <div class="nav-item active" data-nav="shorts"><i class="fas fa-compact-disc"></i>Shorts</div>
            </div>
        </div>

        <!-- === LONG VIDEO SCREEN === -->
        <div id="long-video-screen" class="screen">
            <div class="long-video-screen-content">
                <div id="long-video-top-bar">
                    <div id="long-video-menu-icon" class="home-menu-icon haptic-trigger">
                        <i class="fas fa-bars"></i>
                    </div>
                    <div id="long-video-category-scroller" class="category-scroller"></div>
                </div>
                <div id="long-video-carousel-container">
                    <div id="long-video-carousel-wrapper"></div>
                </div>
                <div class="long-video-search-container">
                    <input type="text" id="long-video-search-input" placeholder="Search or paste YouTube link...">
                    <button id="long-video-search-btn" class="haptic-trigger"><i class="fas fa-search"></i></button>
                    <button id="long-video-history-btn" class="haptic-trigger"><i class="fas fa-history"></i></button>
                </div>
                <div id="long-video-grid"></div>
                <!-- "Load More" button is dynamically added here by script.js -->
            </div>
            <div class="bottom-nav">
                <div class="nav-item" data-nav="home"><i class="fas fa-home"></i>Home</div>
                <div class="nav-item" data-nav="movies"><i class="fas fa-film"></i>Movies</div>
                <div class="nav-item" data-nav="web-series"><i class="fas fa-tv"></i>Web Series</div>
                <div class="nav-item active" data-nav="long-video"><i class="fas fa-video"></i>Long Video</div>
                <div class="nav-item" data-nav="shorts"><i class="fas fa-compact-disc"></i>Shorts</div>
            </div>
        </div>

        <!-- ★★★ ★★★ बदला हुआ मूवी स्क्रीन ★★★ ★★★ -->
        <div id="movies-screen" class="screen">
            <div class="screen-header transparent">
                <div id="movies-menu-icon" class="home-menu-icon haptic-trigger">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="header-search-container">
                    <input type="text" id="movies-search-input" class="header-search-input" placeholder="Search movies...">
                    <button id="movies-search-btn" class="header-search-btn haptic-trigger"><i class="fas fa-search"></i></button>
                </div>
            </div>
            <!-- ★★★ HTML का स्ट्रक्चर बदला गया: यहाँ अब कैटेगरी की लाइनें आएंगी ★★★ -->
            <div id="movies-content-container" class="media-screen-content" style="padding-top: 60px;">
                <!-- Movie categories will be injected here by JavaScript -->
                <div class="loader-container"><div class="loader"></div></div>
            </div>
            <div class="bottom-nav">
                <div class="nav-item" data-nav="home"><i class="fas fa-home"></i>Home</div>
                <div class="nav-item active" data-nav="movies"><i class="fas fa-film"></i>Movies</div>
                <div class="nav-item" data-nav="web-series"><i class="fas fa-tv"></i>Web Series</div>
                <div class="nav-item" data-nav="long-video"><i class="fas fa-video"></i>Long Video</div>
                <div class="nav-item" data-nav="shorts"><i class="fas fa-compact-disc"></i>Shorts</div>
            </div>
        </div>
        
        <!-- ★★★ ★★★ बदला हुआ वेब-सीरीज़ स्क्रीन ★★★ ★★★ -->
        <div id="web-series-screen" class="screen">
             <div class="screen-header transparent">
                 <div id="web-series-menu-icon" class="home-menu-icon haptic-trigger">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="header-search-container">
                    <input type="text" id="web-series-search-input" class="header-search-input" placeholder="Search web series...">
                    <button id="web-series-search-btn" class="header-search-btn haptic-trigger"><i class="fas fa-search"></i></button>
                </div>
            </div>
            <!-- ★★★ HTML का स्ट्रक्चर बदला गया: यहाँ अब कैटेगरी की लाइनें आएंगी ★★★ -->
            <div id="web-series-content-container" class="media-screen-content" style="padding-top: 60px;">
                <!-- Web series categories will be injected here by JavaScript -->
                <div class="loader-container"><div class="loader"></div></div>
            </div>
            <div class="bottom-nav">
                <div class="nav-item" data-nav="home"><i class="fas fa-home"></i>Home</div>
                <div class="nav-item" data-nav="movies"><i class="fas fa-film"></i>Movies</div>
                <div class="nav-item active" data-nav="web-series"><i class="fas fa-tv"></i>Web Series</div>
                <div class="nav-item" data-nav="long-video"><i class="fas fa-video"></i>Long Video</div>
                <div class="nav-item" data-nav="shorts"><i class="fas fa-compact-disc"></i>Shorts</div>
            </div>
        </div>

        <!-- ★★★ नया यूनिफाइड मीडिया प्लेयर स्क्रीन (मूवी और वेब-सीरीज़ दोनों के लिए) ★★★ -->
        <div id="media-player-screen" class="screen">
            <div id="media-player-container">
                 <div class="player-controls-header">
                    <div class="player-back-button haptic-trigger" onclick="navigateBackFromMediaPlayer()">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                    <div class="player-zoom-controls">
                        <button id="media-player-zoom-out-btn" class="haptic-trigger">
                            <i class="fas fa-search-minus"></i>
                        </button>
                        <button id="media-player-zoom-in-btn" class="haptic-trigger">
                            <i class="fas fa-search-plus"></i>
                        </button>
                    </div>
                    <button id="media-player-rotate-btn" class="haptic-trigger">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                <div class="player-wrapper">
                    <iframe id="media-player-iframe-container" 
                            src=""
                            allow="autoplay; encrypted-media; fullscreen"
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
        </div>
        
        <!-- === HISTORY SCREEN === -->
        <div id="history-screen" class="screen">
            <div class="history-content">
                <div id="history-top-bar">
                    <div id="back-from-history-btn" class="home-menu-icon haptic-trigger">
                        <i class="fas fa-arrow-left"></i>
                    </div>
                    <span class="header-title">Watch History</span>
                    <button id="history-date-button" class="haptic-trigger">Clear All</button>
                </div>
                <div class="history-section-title">Recently Watched Shorts</div>
                <div id="history-shorts-scroller"></div>
                <div class="history-section-title">Watched Videos</div>
                <div id="history-long-video-list"></div>
            </div>
            <div class="bottom-nav">
                <div class="nav-item" data-nav="home"><i class="fas fa-home"></i>Home</div>
                <div class="nav-item" data-nav="movies"><i class="fas fa-film"></i>Movies</div>
                <div class="nav-item" data-nav="web-series"><i class="fas fa-tv"></i>Web Series</div>
                <div class="nav-item" data-nav="long-video"><i class="fas fa-video"></i>Long Video</div>
                <div class="nav-item" data-nav="shorts"><i class="fas fa-compact-disc"></i>Shorts</div>
            </div>
        </div>

        <!-- === CREATOR PAGE SCREEN === -->
        <div id="creator-page-screen" class="screen">
            <div class="screen-header">
                <div class="header-icon-left haptic-trigger" onclick="navigateBack()"><i
                        class="fas fa-arrow-left"></i></div>
                <div id="creator-page-tabs"></div>
            </div>
            <div id="creator-page-content" class="content-area">
                <!-- Content injected by JS -->
            </div>
        </div>

    </div> <!-- End of .app-container -->

    <!-- === SCRIPTS (MUST BE AT THE END) === -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-analytics.js"></script>
    <script src="https://www.youtube.com/iframe_api"></script>

    <script>
        // ★★★★★★★★★★ ज़रूरी बदलाव: Shubhzone Firebase कॉन्फ़िगरेशन ★★★★★★★★★★
        // यह Web SDK है, जो सिर्फ यूजर की पहचान (Authentication) के लिए इस्तेमाल होगा।
        const firebaseConfig = {
            apiKey: "AIzaSyDuvWTMJL5edNG6cheez5pmwI2KlLCwtjw",
            authDomain: "shubhzone-4a6b0.firebaseapp.com",
            databaseURL: "https://shubhzone-4a6b0-default-rtdb.firebaseio.com",
            projectId: "shubhzone-4a6b0",
            storageBucket: "shubhzone-4a6b0.appspot.com",
            messagingSenderId: "439309269785",
            appId: "1:439309269785:web:08a1256812648daafea388",
            measurementId: "G-5S0VFF21SB"
        };

        // Firebase को केवल एक बार शुरू करें
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // Firebase सेवाओं को इनिशियलाइज़ करें
        const auth = firebase.auth();
        const db = firebase.firestore();
        // ★★★★★★★★★★ ज़रूरी बदलाव खत्म ★★★★★★★★★★


        // =================================================
        // ★★★ Helper Functions - START ★★★
        // =================================================

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function escapeHTML(str) {
            if (typeof str !== 'string') return '';
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(str));
            return div.innerHTML;
        }
        
        function escapeAttribute(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        }

        function formatNumber(num) {
            if (num === null || num === undefined) return 0;
            if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
            if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
            if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            return num;
        }

        function extractYouTubeId(url) {
            if (!url) return null;
            if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
                return url;
            }
            const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(regex);
            return match ? match[1] : null;
        }

        // =================================================
        // ★★★ Helper Functions - END ★★★
        // =================================================

        let appState = {
            currentUser: { uid: null },
            currentScreen: 'splash-screen',
            navigationStack: ['splash-screen'],
        };

        let isYouTubeApiReady = false;
        let players = {};
        let videoObserver;
        let activePlayerId = null;
        let userHasInteracted = false;
        
        const MEDIA_GENRES = [
            { id: 'latest', name: 'Latest Releases' },
            { id: 28, name: 'Action' },
            { id: 12, name: 'Adventure' },
            { id: 35, name: 'Comedy' },
            { id: 18, name: 'Drama' },
            { id: 27, name: 'Horror' },
            { id: 10749, name: 'Romance' },
            { id: 878, name: 'Sci-Fi' },
            { id: 53, name: 'Thriller' }
        ];

        // =============================================================================
        // ★★★ YOUTUBE, HISTORY, CREATOR PAGE, SHORTS etc. (All Unchanged Functions) ★★★
        // =============================================================================
        async function fetchFromYouTubeAPI(type, params) { /* Unchanged */ }
        function renderYouTubeLongVideos(videos, append = false) { /* Unchanged */ }
        async function loadMoreLongVideos() { /* Unchanged */ }
        async function playYouTubeVideoFromCard(videoId) { /* Unchanged */ }
        function activateScreen(screenId) { document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); document.getElementById(screenId)?.classList.add('active'); appState.currentScreen = screenId; }
        function navigateTo(nextScreenId, payload = null) { if (appState.currentScreen === 'home-screen' && activePlayerId && players[activePlayerId]) { players[activePlayerId].pauseVideo(); } activateScreen(nextScreenId); if (nextScreenId === 'movies-screen') setupMoviesScreen(); if (nextScreenId === 'web-series-screen') setupWebSeriesScreen(); }
        function navigateBack() { /* Unchanged */ }
        function initializeApp() { auth.onAuthStateChanged(user => { if (user) appState.currentUser.uid = user.uid; else auth.signInAnonymously(); }); activateScreen('splash-screen'); }
        function updateNavActiveState(activeNav) { document.querySelectorAll('.bottom-nav').forEach(navBar => { navBar.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active')); const currentItem = navBar.querySelector(`.nav-item[data-nav="${activeNav}"]`); if (currentItem) currentItem.classList.add('active'); }); }
        const startAppLogic = async () => { document.getElementById('get-started-btn').style.display = 'none'; document.getElementById('loading-container').style.display = 'flex'; navigateTo('main-home-screen'); updateNavActiveState('home'); };
        function onYouTubeIframeAPIReady() { /* Unchanged */ }
        async function setupLongVideoScreen() { /* Unchanged */ }

        // ★★★★★★★★★★ यहाँ है मुख्य बदलाव और समाधान ★★★★★★★★★★

        // --- मूवी स्क्रीन को सेट करने का फंक्शन (पूरी तरह से नया) ---
        async function setupMoviesScreen() {
            const contentContainer = document.getElementById('movies-content-container');
            contentContainer.innerHTML = '<div class="loader-container"><div class="loader"></div></div>'; // लोडर दिखाएं

            try {
                // आपकी मांग के अनुसार, हम सिर्फ 'latest' वाली लिस्ट एक बार लेंगे
                const response = await fetch('/api/media-by-genre?genreId=latest&mediaType=movie');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const itemsToRender = data.results || [];

                contentContainer.innerHTML = ''; // लोडर हटाएं

                if (itemsToRender.length === 0) {
                     contentContainer.innerHTML = '<p class="static-message">No movies found. Please wait for the worker to add new content.</p>';
                } else {
                    // अब हर कैटेगरी के लिए इसी लिस्ट को इस्तेमाल करके पंक्तियाँ बनाएं
                    for (const genre of MEDIA_GENRES) {
                        renderCategoryRow(genre, itemsToRender, 'movie', contentContainer);
                    }
                }
            } catch (error) {
                console.error("Movies screen setup failed:", error);
                contentContainer.innerHTML = '<p class="static-message">Could not load movies. Please try again later.</p>';
            }
            
            // अंत में अस्वीकरण (Disclaimer) जोड़ें
            contentContainer.insertAdjacentHTML('beforeend', `<div class="media-disclaimer"><strong>अस्वीकरण:</strong> यहाँ दिखाया गया कंटेंट थर्ड-पार्टी स्रोतों द्वारा प्रदान किया जाता है। हम किसी भी कंटेंट को होस्ट नहीं करते हैं।</div>`);
        }
        
        // --- वेब-सीरीज़ स्क्रीन को सेट करने का फंक्शन (पूरी तरह से नया) ---
        async function setupWebSeriesScreen() {
            const contentContainer = document.getElementById('web-series-content-container');
            contentContainer.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

             try {
                // वेब-सीरीज़ के लिए भी 'latest' वाली लिस्ट एक बार लेंगे
                const response = await fetch('/api/media-by-genre?genreId=latest&mediaType=tv');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const itemsToRender = data.results || [];

                contentContainer.innerHTML = ''; // लोडर हटाएं

                if (itemsToRender.length === 0) {
                     contentContainer.innerHTML = '<p class="static-message">No web series found. Please wait for the worker to add new content.</p>';
                } else {
                    // अब हर कैटेगरी के लिए इसी लिस्ट को इस्तेमाल करके पंक्तियाँ बनाएं
                    for (const genre of MEDIA_GENRES) {
                        renderCategoryRow(genre, itemsToRender, 'tv', contentContainer);
                    }
                }
            } catch (error) {
                console.error("Web Series screen setup failed:", error);
                contentContainer.innerHTML = '<p class="static-message">Could not load web series. Please try again later.</p>';
            }

            contentContainer.insertAdjacentHTML('beforeend', `<div class="media-disclaimer"><strong>अस्वीकरण:</strong> यहाँ दिखाया गया कंटेंट थर्ड-पार्टी स्रोतों द्वारा प्रदान किया जाता है। हम किसी भी कंटेंट को होस्ट नहीं करते हैं।</div>`);
        }

        // --- कैटेगरी की पंक्ति बनाने वाला नया फंक्शन ---
        function renderCategoryRow(genre, items, mediaType, container) {
            // अगर उस लिस्ट में कोई आइटम है, तभी लाइन बनाएं
            if (items.length > 0) {
                const categoryRowHTML = `
                    <div class="media-category-row">
                        <div class="media-category-header">
                            <h3 class="media-category-title">${escapeHTML(genre.name)}</h3>
                            <button class="media-category-more-btn haptic-trigger">More</button>
                        </div>
                        <div class="media-row-scroller">
                            ${items.map(item => {
                                if (!item.posterPath && !item.poster_path) return '';
                                const posterPath = item.posterPath || item.poster_path;
                                
                                let clickAction = '';
                                if (mediaType === 'movie') {
                                    const linkToPlay = item.workingLink || `https://vidsrc.me/embed/movie/${item.tmdbId}`;
                                    clickAction = `playMedia('${escapeAttribute(linkToPlay)}')`;
                                } else { // वेब-सीरीज़ के लिए
                                    clickAction = `openSeriesDetailModal('${item.tmdbId}', '${escapeAttribute(item.title)}')`;
                                }

                                return `
                                    <div class="media-vertical-card haptic-trigger" 
                                         style="background-image: url('https://image.tmdb.org/t/p/w500${posterPath}')"
                                         onclick="${clickAction}">
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', categoryRowHTML);
            }
        }

        // --- वेब-सीरीज़ के विवरण के लिए Modal (कोई बदलाव नहीं) ---
        const seriesDetailModal = document.getElementById('series-details-modal');
        const seriesDetailTitle = document.getElementById('series-details-title');
        const seriesSeasonsTabs = document.getElementById('series-seasons-tabs');
        const seriesEpisodesList = document.getElementById('series-episodes-list');
        
        async function openSeriesDetailModal(seriesId, seriesTitle) { /* Unchanged */ }
        function renderEpisodes(seriesId, seasonNumber, episodeCount) { /* Unchanged */ }
        document.getElementById('series-details-close-btn').onclick = () => seriesDetailModal.classList.remove('active');
        seriesDetailModal.addEventListener('click', (e) => { if (e.target === seriesDetailModal) seriesDetailModal.classList.remove('active'); });

        
        // ★★★ सबसे ज़रूरी बदलाव: प्रॉक्सी का इस्तेमाल करने वाला `playMedia` फंक्शन ★★★
        function playMedia(embedUrl) {
            // सीधे लिंक की बजाय, हमारे सर्वर के बनाए गुप्त रास्ते (प्रॉक्सी) का URL बनाएं
            const proxyUrl = `/api/stream?url=${encodeURIComponent(embedUrl)}`;
            
            navigateTo('media-player-screen');
            setTimeout(() => {
                const iframe = document.getElementById('media-player-iframe-container');
                // अब iframe में सीधे ब्लॉक होने वाला लिंक नहीं, बल्कि हमारा सुरक्षित प्रॉक्सी URL जाएगा
                if (iframe) {
                    iframe.src = proxyUrl;
                }
                setupMediaPlayerControls();
            }, 100);
        }
        
        function setupMediaPlayerControls() {
            document.getElementById('media-player-rotate-btn').onclick = () => document.getElementById('app-container').classList.toggle('fullscreen-active');
            let currentZoom = 1.0;
            const playerWrapper = document.querySelector('#media-player-container .player-wrapper');
            if(playerWrapper) playerWrapper.style.transform = `scale(1.0)`;
            document.getElementById('media-player-zoom-in-btn').onclick = () => { currentZoom = Math.min(2.5, currentZoom + 0.1); playerWrapper.style.transform = `scale(${currentZoom})`; };
            document.getElementById('media-player-zoom-out-btn').onclick = () => { currentZoom = Math.max(0.5, currentZoom - 0.1); playerWrapper.style.transform = `scale(${currentZoom})`; };
        }
        
        function navigateBackFromMediaPlayer() {
            navigateBack();
        }

        // ★★★★★★★★★★ समाधान खत्म ★★★★★★★★★★

        function closeCommentsModal() {
            const commentsModal = document.getElementById('comments-modal');
            if(commentsModal) commentsModal.classList.remove('active');
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.add('haptic-trigger');
                item.addEventListener('click', () => {
                    const targetNav = item.getAttribute('data-nav');
                    let targetScreen;
                    switch (targetNav) {
                        case 'home': targetScreen = 'main-home-screen'; break;
                        case 'shorts': targetScreen = 'home-screen'; break;
                        case 'web-series': targetScreen = 'web-series-screen'; break;
                        default: targetScreen = `${targetNav}-screen`;
                    }
                    navigateTo(targetScreen);
                    updateNavActiveState(targetNav);
                });
            });

            initializeApp();

            document.getElementById('get-started-btn')?.addEventListener('click', () => {
                userHasInteracted = true;
                startAppLogic();
            });
            
            document.getElementById('app-container').addEventListener('click', (event) => {
                if (!userHasInteracted) userHasInteracted = true;
            });

            // Sidebar and other event listeners (Unchanged)
            const openSidebar = () => { document.getElementById('main-sidebar').classList.add('open'); document.getElementById('sidebar-overlay').classList.add('open'); };
            ['shorts-menu-icon', 'long-video-menu-icon', 'movies-menu-icon', 'web-series-menu-icon'].forEach(id => document.getElementById(id)?.addEventListener('click', openSidebar));
            const closeSidebar = () => { document.getElementById('main-sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.remove('open'); };
            document.getElementById('close-sidebar-btn')?.addEventListener('click', closeSidebar);
            document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
        });

        const setAppHeight = () => {
            document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
        };
        window.addEventListener('resize', setAppHeight);
        setAppHeight();
    </script>
</body>

</html>
