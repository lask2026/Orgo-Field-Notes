"""PDF paragraph/glyph regressions; run with requirements-audit.txt installed."""
import unittest, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]/"review/scripts"))
from make_pdfs import para

class FontChecks(unittest.TestCase):
 def test_equilibrium_arrow_remains_real_text_with_supported_font(self):
  text='HA + B ⇌ A− + BH+'
  for style in ['BodyText','Heading2','SmallAudit']:
   paragraph=para(text,style)
   self.assertEqual(paragraph.getPlainText(),text)
   self.assertTrue(any(f.fontName=='AuditSymbols' and '⇌' in f.text for f in paragraph.frags))

 def test_decorative_hand_and_presentation_selector_have_printable_equivalent(self):
  paragraph=para('\U0001f590\ufe0f Select the atom.')
  self.assertEqual(paragraph.getPlainText(),'Hands-on: Select the atom.')

 def test_unmapped_supplementary_character_fails_instead_of_corrupting_pdf_text(self):
  with self.assertRaisesRegex(ValueError,'PDF text mapping'):
   para('Unknown: '+chr(0x10ffff))

if __name__=='__main__':unittest.main(verbosity=2)
