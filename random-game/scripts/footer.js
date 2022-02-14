function createFooter() {
	const footer = document.createElement('footer');
	footer.classList = 'footer';
	footer.innerHTML = `
		<div class="container">
			<div class="footer__body">
				<div class="copyright">
					<span>© 2022</span>
					<a href="https://github.com/Dauhaliavets" class="copyright-link"
						>github</a
					>
				</div>
				<a href="https://rs.school/js-stage0/" class="rss-link"
					>Rolling Scopes School</a
				>
			</div>
		</div>
	`;

	return footer;
}

export default createFooter;
